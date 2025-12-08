import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../../entities/invoice.entity';
import { Appointment } from '../../entities/appointment.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,

    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoice = this.invoiceRepository.create(createInvoiceDto);
    return this.invoiceRepository.save(invoice);
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      relations: ['appointment', 'owner'],
    });
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { invoice_id: id },
      relations: ['appointment', 'owner'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    // Lấy invoice hiện tại
    const invoice = await this.findOne(id);

    const previousStatus = invoice.payment_status;
    const previousHistory = Array.isArray(invoice.payment_history)
      ? invoice.payment_history
      : [];

    // Gộp dữ liệu mới
    Object.assign(invoice, updateInvoiceDto);

    // Lưu lần 1
    let saved = await this.invoiceRepository.save(invoice);

    // Nếu có thay đổi liên quan thanh toán → ghi history
    if (updateInvoiceDto.payment_status || updateInvoiceDto.payment_date) {
      const historyEntry = {
        status: saved.payment_status,
        payment_date: (saved.payment_date ?? new Date()).toISOString(),
        changed_by: saved.issued_by,
      };

      saved.payment_history = [...previousHistory, historyEntry];
      saved = await this.invoiceRepository.save(saved);
    }

    // Nếu vừa chuyển sang Paid → archive appointment
    if (previousStatus !== 'Paid' && saved.payment_status === 'Paid') {
      const appointmentId = saved.appointment_id;

      if (appointmentId) {
        await this.appointmentRepository.update(
          { appointment_id: appointmentId },
          { status: 'Archived' },
        );
      }
    }

    return saved;
  }

  async remove(id: number): Promise<void> {
    const invoice = await this.findOne(id);
    await this.invoiceRepository.remove(invoice);
  }
}
