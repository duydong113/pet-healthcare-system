import { IsNumber, IsDate, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsNumber()
  pet_id: number;

  @ApiProperty()
  @IsNumber()
  service_id: number;

  @ApiProperty()
  @IsNumber()
  staff_id: number;

  @ApiProperty()
  @IsNumber()
  owner_id: number;

  @ApiProperty({ example: '2024-12-25T10:00:00' })
  @Type(() => Date)
  @IsDate()
  appointment_date: Date;

  @ApiProperty({ example: 'Pending' })
  @IsEnum(['Pending', 'Completed', 'Canceled'])
  status: string;
}