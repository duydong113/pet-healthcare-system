import { IsString, IsNumber, IsDate, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePetDto {
  @ApiProperty()
  @IsNumber()
  owner_id: number;

  @ApiProperty({ example: 'Max' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Dog' })
  @IsString()
  @MaxLength(50)
  species: string;

  @ApiProperty({ example: 'Male' })
  @IsEnum(['Male', 'Female'])
  gender: string;

  @ApiProperty({ example: '2020-01-15' })
  @Type(() => Date)
  @IsDate()
  dob: Date;

  @ApiProperty({ example: 15.5 })
  @IsNumber()
  weight: number;
}