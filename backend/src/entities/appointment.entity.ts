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

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  appointment_id: number;

  @Column()
  pet_id: number;

  @Column()
  service_id: number;

  @Column()
  staff_id: number;

  @Column({ nullable: true })
  owner_id: number;

  @Column({ type: 'datetime' })
  appointment_date: Date;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Completed', 'Canceled'],
    default: 'Pending',
  })
  status: string;

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}