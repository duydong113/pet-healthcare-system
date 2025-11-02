import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';

// Import modules
import { AuthModule } from './modules/auth/auth.module';
import { PetOwnerModule } from './modules/pet-owner/pet-owner.module';
import { PetModule } from './modules/pet/pet.module';
import { ServiceModule } from './modules/service/service.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { StaffModule } from './modules/staff/staff.module';
import { MedicalRecordModule } from './modules/medical-record/medical-record.module';
import { InvoiceModule } from './modules/invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    PetOwnerModule,
    PetModule,
    ServiceModule,
    AppointmentModule,
    StaffModule,
    MedicalRecordModule,
    InvoiceModule,
  ],
})
export class AppModule {}