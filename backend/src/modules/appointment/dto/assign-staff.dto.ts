import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignStaffDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  staff_id: number;
}