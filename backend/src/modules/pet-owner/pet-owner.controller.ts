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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PetOwnerService } from './pet-owner.service';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import { UpdatePetOwnerDto } from './dto/update-pet-owner.dto';

@ApiTags('Pet Owners')
@Controller('pet-owners')
export class PetOwnerController {
  constructor(private readonly petOwnerService: PetOwnerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pet owner' })
  @ApiResponse({ status: 201, description: 'Pet owner created successfully' })
  create(@Body() createPetOwnerDto: CreatePetOwnerDto) {
    return this.petOwnerService.create(createPetOwnerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pet owners' })
  @ApiResponse({ status: 200, description: 'Return all pet owners' })
  findAll() {
    return this.petOwnerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pet owner by ID' })
  @ApiResponse({ status: 200, description: 'Return the pet owner' })
  @ApiResponse({ status: 404, description: 'Pet owner not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.petOwnerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a pet owner' })
  @ApiResponse({ status: 200, description: 'Pet owner updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetOwnerDto: UpdatePetOwnerDto,
  ) {
    return this.petOwnerService.update(id, updatePetOwnerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pet owner' })
  @ApiResponse({ status: 200, description: 'Pet owner deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.petOwnerService.remove(id);
  }
}