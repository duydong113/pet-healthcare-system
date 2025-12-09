// backend/src/modules/appointment/appointment.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Appointment } from '../../entities/appointment.entity';
import { AppointmentService as AppointmentServiceEntity } from '../../entities/appointment-service.entity';
import { Service } from '../../entities/service.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AssignStaffDto } from './dto/assign-staff.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(AppointmentServiceEntity)
    private readonly appointmentServiceRepository: Repository<AppointmentServiceEntity>,

    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  /**
   * Tạo cuộc hẹn mới
   */
  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    // 1. Kiểm tra slot thời gian có trống không
    const isAvailable = await this.checkTimeSlotAvailability(
      createAppointmentDto.appointment_date,
      createAppointmentDto.staff_id,
    );

    if (!isAvailable) {
      throw new BadRequestException(
        'Time slot is not available. Please choose another time.',
      );
    }

    // 2. Tạo Appointment entity
    const appointment = this.appointmentRepository.create({
      pet_id: createAppointmentDto.pet_id,
      owner_id: createAppointmentDto.owner_id,
      staff_id: createAppointmentDto.staff_id ?? undefined,
      appointment_date: createAppointmentDto.appointment_date,
      note: createAppointmentDto.note,
      status: createAppointmentDto.staff_id ? 'Assigned' : 'Pending',
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);

    // 3. Thêm các services vào bảng appointment_services
    if (
      createAppointmentDto.service_ids &&
      createAppointmentDto.service_ids.length > 0
    ) {
      for (const serviceId of createAppointmentDto.service_ids) {
        const service = await this.serviceRepository.findOne({
          where: { service_id: serviceId },
        });

        if (!service) continue;

        const appointmentService =
          this.appointmentServiceRepository.create({
            appointment_id: savedAppointment.appointment_id,
            service_id: serviceId,
            price: service.price,
          });

        await this.appointmentServiceRepository.save(appointmentService);
      }
    }

    // 4. Trả về appointment đầy đủ relation
    return this.findOne(savedAppointment.appointment_id);
  }

  /**
   * Kiểm tra 1 slot thời gian có trống không (±30 phút)
   */
  async checkTimeSlotAvailability(
    appointmentDate: Date,
    staffId?: number,
  ): Promise<boolean> {
    const startTime = new Date(appointmentDate);
    startTime.setMinutes(startTime.getMinutes() - 30); // 30 phút trước

    const endTime = new Date(appointmentDate);
    endTime.setMinutes(endTime.getMinutes() + 30); // 30 phút sau

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .where(
        'appointment.appointment_date BETWEEN :startTime AND :endTime',
        {
          startTime,
          endTime,
        },
      )
      .andWhere('appointment.status NOT IN (:...statuses)', {
        statuses: ['Canceled', 'Archived'],
      });

    if (staffId) {
      queryBuilder.andWhere('appointment.staff_id = :staffId', { staffId });
    }

    const conflictingAppointments = await queryBuilder.getCount();

    return conflictingAppointments === 0;
  }

  /**
   * Lấy danh sách slot trống trong 1 ngày (8:00–17:00, mỗi 30 phút)
   */
  async getAvailableTimeSlots(
    date: string,
    staffId?: number,
  ): Promise<string[]> {
    const targetDate = new Date(date);
    const allSlots: Date[] = [];
    const availableSlots: string[] = [];

    // Tạo các slot từ 08:00 đến 17:00, mỗi slot 30 phút
    for (let hour = 8; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(targetDate);
        slotTime.setHours(hour, minute, 0, 0);
        allSlots.push(slotTime);
      }
    }

    // Check từng slot
    for (const slot of allSlots) {
      const isAvailable = await this.checkTimeSlotAvailability(slot, staffId);
      if (isAvailable) {
        availableSlots.push(slot.toISOString());
      }
    }

    return availableSlots;
  }

  /**
   * Lấy tất cả appointments
   * Mặc định ẩn Archived (coi như đã xoá mềm)
   */
  async findAll(includeArchived = false): Promise<Appointment[]> {
    const where = includeArchived ? {} : { status: Not('Archived') };

    return this.appointmentRepository.find({
      where,
      relations: [
        'pet',
        'service',
        'staff',
        'owner',
        'appointmentServices',
        'appointmentServices.service',
      ],
      order: { appointment_date: 'ASC' },
    });
  }

  /**
   * Lấy 1 appointment theo ID
   */
  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { appointment_id: id },
      relations: [
        'pet',
        'service',
        'staff',
        'owner',
        'appointmentServices',
        'appointmentServices.service',
      ],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  /**
   * Lấy appointments đang Pending (cho staff assign)
   */
  async findPendingAppointments(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { status: 'Pending' },
      relations: [
        'pet',
        'owner',
        'appointmentServices',
        'appointmentServices.service',
      ],
      order: { appointment_date: 'ASC' },
    });
  }

  /**
   * Assign staff cho appointment (và check slot)
   */
  async assignStaff(
    id: number,
    assignStaffDto: AssignStaffDto,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);

    const isAvailable = await this.checkTimeSlotAvailability(
      appointment.appointment_date,
      assignStaffDto.staff_id,
    );

    if (!isAvailable) {
      throw new BadRequestException('Staff is not available at this time.');
    }

    appointment.staff_id = assignStaffDto.staff_id;
    appointment.status = 'Assigned';

    return this.appointmentRepository.save(appointment);
  }

  /**
   * Cập nhật appointment (nếu đổi giờ thì check lại slot)
   */
  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);

    // Nếu thay đổi thời gian, kiểm tra slot mới
    if (updateAppointmentDto.appointment_date) {
      const isAvailable = await this.checkTimeSlotAvailability(
        updateAppointmentDto.appointment_date,
        updateAppointmentDto.staff_id ?? appointment.staff_id,
      );

      if (!isAvailable) {
        throw new BadRequestException('New time slot is not available.');
      }
    }

    Object.assign(appointment, updateAppointmentDto);

    return this.appointmentRepository.save(appointment);
  }

  /**
   * "Xoá" appointment → thực chất là soft-delete: chuyển sang Archived
   * để tránh lỗi FK với bảng invoices.
   */
  async remove(id: number): Promise<void> {
    // Đảm bảo appointment tồn tại, nếu không sẽ throw NotFound
    await this.findOne(id);

    // KHÔNG DELETE, chỉ update status
    await this.appointmentRepository.update(
      { appointment_id: id },
      { status: 'Archived' },
    );
  }
}
