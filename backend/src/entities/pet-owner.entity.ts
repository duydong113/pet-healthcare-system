import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pet } from './pet.entity';
import { Appointment } from './appointment.entity';
import { Invoice } from './invoice.entity';

@Entity('pet_owners')
export class PetOwner {
  @PrimaryGeneratedColumn()
  owner_id: number;

  @Column({ length: 100 })
  full_name: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @OneToMany(() => Pet, (pet) => pet.owner)
  pets: Pet[];

  @OneToMany(() => Appointment, (appointment) => appointment.owner)
  appointments: Appointment[];

  @OneToMany(() => Invoice, (invoice) => invoice.owner)
  invoices: Invoice[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}