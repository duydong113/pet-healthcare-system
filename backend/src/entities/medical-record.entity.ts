import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { Pet } from './pet.entity';
import { Staff } from './staff.entity';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  record_id: number;

  @Column()
  appointment_id: number;

  @Column({ nullable: true })
  pet_id: number;

  @Column({ nullable: true })
  staff_id: number;

  @Column({ type: 'text' })
  diagnosis: string;

  @Column({ type: 'text' })
  treatment: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @OneToOne(() => Appointment, appointment => appointment.medical_record, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @ManyToOne(() => Pet, (pet) => pet.medical_records)
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @ManyToOne(() => Staff, (staff) => staff.medical_records)
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @CreateDateColumn()
  created_at: Date;
}