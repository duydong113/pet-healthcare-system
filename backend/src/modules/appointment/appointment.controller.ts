// backend/src/modules/appointment/appointment.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AssignStaffDto } from './dto/assign-staff.dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending appointments (for staff to assign)' })
  findPending() {
    return this.appointmentService.findPendingAppointments();
  }

  @Get('available-slots')
  @ApiOperation({ summary: 'Get available time slots' })
  @ApiQuery({ name: 'date', example: '2024-12-25' })
  @ApiQuery({ name: 'staffId', required: false })
  getAvailableSlots(
    @Query('date') date: string,
    @Query('staffId') staffId?: number,
  ) {
    return this.appointmentService.getAvailableTimeSlots(date, staffId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an appointment by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an appointment' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Patch(':id/assign-staff')
  @ApiOperation({ summary: 'Assign staff to appointment' })
  assignStaff(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignStaffDto: AssignStaffDto,
  ) {
    return this.appointmentService.assignStaff(id, assignStaffDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.remove(id);
  }
}