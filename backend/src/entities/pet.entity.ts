import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PetOwner } from './pet-owner.entity';
import { Appointment } from './appointment.entity';
import { MedicalRecord } from './medical-record.entity';

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn()
  pet_id: number;

  @Column()
  owner_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  species: string;

  @Column({ length: 10 })
  gender: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number;

  @ManyToOne(() => PetOwner, (owner) => owner.pets)
  @JoinColumn({ name: 'owner_id' })
  owner: PetOwner;

  @OneToMany(() => Appointment, (appointment) => appointment.pet)
  appointments: Appointment[];

  @OneToMany(() => MedicalRecord, (record) => record.pet)
  medical_records: MedicalRecord[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}