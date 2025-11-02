import { IsString, IsNumber, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Vaccination' })
  @IsString()
  @MaxLength(100)
  service_name: string;

  @ApiProperty({ example: 'Annual vaccination service' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 50.00 })
  @IsNumber()
  price: number;
}