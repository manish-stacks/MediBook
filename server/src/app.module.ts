import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import { ClinicsModule } from './clinics/clinics.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { SlotsModule } from './slots/slots.module';
import { PatientsModule } from './patients/patients.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BlogsModule } from './blogs/blogs.module';
import { SpecialitiesModule } from './specialities/specialities.module';
import { AdminModule } from './admin/admin.module';
import { FavoritesModule } from './favorites/favorites.module';
import { SettingsModule } from './settings/settings.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ScheduleModule.forRoot(),
    PrismaModule,
    MailModule,
    AuthModule,
    UsersModule,
    DoctorsModule,
    ClinicsModule,
    AppointmentsModule,
    SlotsModule,
    PatientsModule,
    PrescriptionsModule,
    PaymentsModule,
    NotificationsModule,
    BlogsModule,
    SpecialitiesModule,
    AdminModule,
    FavoritesModule,
    SettingsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}