import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Staff } from '../../entities/staff.entity';
import { PetOwner } from '../../entities/pet-owner.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(PetOwner)
    private petOwnerRepository: Repository<PetOwner>,
    private jwtService: JwtService,
  ) {}

  async loginStaff(loginDto: LoginDto) {
    const staff = await this.staffRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!staff) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      staff.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      sub: staff.staff_id, 
      email: staff.email, 
      role: staff.role,
      type: 'staff'
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: staff.staff_id,
        email: staff.email,
        full_name: staff.full_name,
        role: staff.role,
        type: 'staff'
      },
    };
  }

  async loginOwner(loginDto: LoginDto) {
    const owner = await this.petOwnerRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!owner) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      owner.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      sub: owner.owner_id, 
      email: owner.email,
      type: 'owner'
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: owner.owner_id,
        email: owner.email,
        full_name: owner.full_name,
        type: 'owner'
      },
    };
  }
}