import { IsNumber, IsString, IsEnum, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {
  @ApiProperty()
  @IsNumber()
  appointment_id: number;

  @ApiProperty()
  @IsNumber()
  owner_id: number;

  @ApiProperty({ example: 50.00 })
  @IsNumber()
  base_amount: number;

  @ApiProperty({ example: 10.00 })
  @IsNumber()
  additional_cost: number;

  @ApiProperty({ example: 60.00 })
  @IsNumber()
  total_amount: number;

  @ApiProperty({ example: 'Cash' })
  @IsString()
  payment_method: string;

  @ApiProperty({ example: 'Pending' })
  @IsEnum(['Pending', 'Paid', 'Canceled'])
  payment_status: string;

  @ApiProperty({ example: '2024-12-25' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  payment_date?: Date;

  @ApiProperty({ example: 'Admin' })
  @IsString()
  issued_by: string;
}
