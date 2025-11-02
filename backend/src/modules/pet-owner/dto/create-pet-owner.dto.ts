import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePetOwnerDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MaxLength(100)
  full_name: string;

  @ApiProperty({ example: '0123456789' })
  @IsString()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;
}
