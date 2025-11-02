import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { PetOwner } from './pet-owner.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  invoice_id: number;

  @Column()
  appointment_id: number;

  @Column({ nullable: true })
  owner_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  additional_cost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ length: 50 })
  payment_method: string;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Paid', 'Canceled'],
    default: 'Pending',
  })
  payment_status: string;

  @Column({ type: 'date', nullable: true })
  payment_date: Date;

  @Column({ length: 100 })
  issued_by: string;

  @OneToOne(() => Appointment, (appointment) => appointment.invoice)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @ManyToOne(() => PetOwner, (owner) => owner.invoices)
  @JoinColumn({ name: 'owner_id' })
  owner: PetOwner;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}