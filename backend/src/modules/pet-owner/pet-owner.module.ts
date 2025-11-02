import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetOwner } from '../../entities/pet-owner.entity';
import { PetOwnerService } from './pet-owner.service';
import { PetOwnerController } from './pet-owner.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PetOwner])],
  controllers: [PetOwnerController],
  providers: [PetOwnerService],
  exports: [PetOwnerService],
})
export class PetOwnerModule {}