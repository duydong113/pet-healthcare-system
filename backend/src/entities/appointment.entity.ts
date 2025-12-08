import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pet } from './pet.entity';
import { Service } from './service.entity';
import { Staff } from './staff.entity';
import { PetOwner } from './pet-owner.entity';
import { MedicalRecord } from './medical-record.entity';
import { Invoice } from './invoice.entity';
import { AppointmentService } from './appointment-service.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  appointment_id: number;

  @Column()
  pet_id: number;

  @Column({ nullable: true })
  service_id: number; // Giữ lại để backward compatible, nhưng sẽ dùng appointmentServices

  @Column({ nullable: true })
  staff_id: number; // NULL khi chưa assign

  @Column({ nullable: true })
  owner_id: number;

  @Column({ type: 'datetime' })
  appointment_date: Date;

  @Column({
  type: 'enum',
  enum: ['Pending', 'Assigned', 'Confirmed', 'Completed', 'Canceled', 'Archived'],
  default: 'Pending',
})
status: string;


  @Column({ type: 'text', nullable: true })
  note: string; // Ghi chú của pet owner

  @ManyToOne(() => Pet, (pet) => pet.appointments)
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @ManyToOne(() => Service, (service) => service.appointments)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @ManyToOne(() => Staff, (staff) => staff.appointments)
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @ManyToOne(() => PetOwner, (owner) => owner.appointments)
  @JoinColumn({ name: 'owner_id' })
  owner: PetOwner;

  @OneToOne(() => MedicalRecord, (record) => record.appointment)
  medical_record: MedicalRecord;

  @OneToOne(() => Invoice, (invoice) => invoice.appointment)
  invoice: Invoice;

  @OneToMany(() => AppointmentService, (as) => as.appointment)
  appointmentServices: AppointmentService[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}