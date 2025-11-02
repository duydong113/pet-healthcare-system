import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@ApiTags('Pets')
@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pet' })
  create(@Body() createPetDto: CreatePetDto) {
    return this.petService.create(createPetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pets' })
  findAll() {
    return this.petService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pet by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.petService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a pet' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    return this.petService.update(id, updatePetDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pet' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.petService.remove(id);
  }
}
