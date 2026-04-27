"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const prisma_module_1 = require("./prisma/prisma.module");
const mail_module_1 = require("./mail/mail.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const doctors_module_1 = require("./doctors/doctors.module");
const clinics_module_1 = require("./clinics/clinics.module");
const appointments_module_1 = require("./appointments/appointments.module");
const slots_module_1 = require("./slots/slots.module");
const patients_module_1 = require("./patients/patients.module");
const prescriptions_module_1 = require("./prescriptions/prescriptions.module");
const payments_module_1 = require("./payments/payments.module");
const notifications_module_1 = require("./notifications/notifications.module");
const blogs_module_1 = require("./blogs/blogs.module");
const specialities_module_1 = require("./specialities/specialities.module");
const admin_module_1 = require("./admin/admin.module");
const favorites_module_1 = require("./favorites/favorites.module");
const settings_module_1 = require("./settings/settings.module");
const app_controller_1 = require("./app.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            mail_module_1.MailModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            doctors_module_1.DoctorsModule,
            clinics_module_1.ClinicsModule,
            appointments_module_1.AppointmentsModule,
            slots_module_1.SlotsModule,
            patients_module_1.PatientsModule,
            prescriptions_module_1.PrescriptionsModule,
            payments_module_1.PaymentsModule,
            notifications_module_1.NotificationsModule,
            blogs_module_1.BlogsModule,
            specialities_module_1.SpecialitiesModule,
            admin_module_1.AdminModule,
            favorites_module_1.FavoritesModule,
            settings_module_1.SettingsModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map