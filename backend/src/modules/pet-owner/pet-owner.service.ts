import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PetOwner } from '../../entities/pet-owner.entity';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import { UpdatePetOwnerDto } from './dto/update-pet-owner.dto';

@Injectable()
export class PetOwnerService {
  constructor(
    @InjectRepository(PetOwner)
    private petOwnerRepository: Repository<PetOwner>,
  ) {}

  async create(createPetOwnerDto: CreatePetOwnerDto): Promise<PetOwner> {
    const existingOwner = await this.petOwnerRepository.findOne({
      where: { email: createPetOwnerDto.email },
    });

    if (existingOwner) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createPetOwnerDto.password, 10);
    
    const petOwner = this.petOwnerRepository.create({
      ...createPetOwnerDto,
      password: hashedPassword,
    });

    return this.petOwnerRepository.save(petOwner);
  }

  async findAll(): Promise<PetOwner[]> {
    return this.petOwnerRepository.find({
      relations: ['pets', 'appointments', 'invoices'],
    });
  }

  async findOne(id: number): Promise<PetOwner> {
    const petOwner = await this.petOwnerRepository.findOne({
      where: { owner_id: id },
      relations: ['pets', 'appointments', 'invoices'],
    });

    if (!petOwner) {
      throw new NotFoundException(`Pet Owner with ID ${id} not found`);
    }

    return petOwner;
  }

  async update(id: number, updatePetOwnerDto: UpdatePetOwnerDto): Promise<PetOwner> {
    const petOwner = await this.findOne(id);

    if (updatePetOwnerDto.password) {
      updatePetOwnerDto.password = await bcrypt.hash(updatePetOwnerDto.password, 10);
    }

    Object.assign(petOwner, updatePetOwnerDto);
    return this.petOwnerRepository.save(petOwner);
  }

  async remove(id: number): Promise<void> {
    const petOwner = await this.findOne(id);
    await this.petOwnerRepository.remove(petOwner);
  }
}