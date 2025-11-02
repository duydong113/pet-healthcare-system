import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicalRecordDto {
  @ApiProperty()
  @IsNumber()
  appointment_id: number;

  @ApiProperty()
  @IsNumber()
  pet_id: number;

  @ApiProperty()
  @IsNumber()
  staff_id: number;

  @ApiProperty({ example: 'Flu symptoms' })
  @IsString()
  diagnosis: string;

  @ApiProperty({ example: 'Prescribed antibiotics' })
  @IsString()
  treatment: string;

  @ApiProperty({ example: 'Follow up in 2 weeks' })
  @IsString()
  @IsOptional()
  note?: string;
}

