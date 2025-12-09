import { IsOptional, IsString, IsNumber } from 'class-validator';

export class AskPetAiDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsNumber()
  petId?: number;
}
