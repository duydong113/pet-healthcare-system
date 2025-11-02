import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStaffDto {
  @ApiProperty({ example: 'Dr. Jane Smith' })
  @IsString()
  @MaxLength(100)
  full_name: string;

  @ApiProperty({ example: 'Veterinarian' })
  @IsString()
  @MaxLength(50)
  role: string;

  @ApiProperty({ example: '0987654321' })
  @IsString()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ example: 'jane@clinic.com' })
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;
}
