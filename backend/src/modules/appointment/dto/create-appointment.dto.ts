// backend/src/modules/appointment/dto/create-appointment.dto.ts
import { IsNumber, IsDate, IsEnum, IsArray, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  pet_id: number;

  @ApiProperty({ example: [1, 2, 3], description: 'Array of service IDs' })
  @IsArray()
  @IsNumber({}, { each: true })
  service_ids: number[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  staff_id?: number; // Optional - Owner không cần chọn staff

  @ApiProperty({ example: 1 })
  @IsNumber()
  owner_id: number;

  @ApiProperty({ example: '2024-12-25T10:00:00' })
  @Type(() => Date)
  @IsDate()
  appointment_date: Date;

  @ApiProperty({ example: 'My pet needs vaccination', required: false })
  @IsString()
  @IsOptional()
  note?: string;

 @ApiProperty({
  example: 'Pending',
  enum: ['Pending', 'Assigned', 'Confirmed', 'Completed', 'Canceled', 'Archived'],
})
@IsEnum(['Pending', 'Assigned', 'Confirmed', 'Completed', 'Canceled', 'Archived'])
@IsOptional()
status?: string;

}