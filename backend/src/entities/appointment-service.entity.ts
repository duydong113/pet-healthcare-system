import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { Service } from './service.entity';

@Entity('appointment_services')
export class AppointmentService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  appointment_id: number;

  @Column()
  service_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // Giá tại thời điểm đặt (có thể khác giá hiện tại)

  @ManyToOne(() => Appointment, appointment => appointment.appointmentServices, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @ManyToOne(() => Service)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @CreateDateColumn()
  created_at: Date;
}