"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let MailService = MailService_1 = class MailService {
    constructor() {
        this.logger = new common_1.Logger(MailService_1.name);
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: Number(process.env.SMTP_PORT) || 587,
                secure: false,
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            });
        }
    }
    async sendMail(options) {
        if (!this.transporter) {
            this.logger.log(`[EMAIL MOCK] To: ${options.to} | Subject: ${options.subject}`);
            return;
        }
        try {
            await this.transporter.sendMail({ from: `"MediBook" <${process.env.SMTP_USER}>`, ...options });
        }
        catch (err) {
            this.logger.error('Email send failed:', err.message);
        }
    }
    header() {
        return `<div style="background:linear-gradient(135deg,#1e6fe8,#02c9b3);padding:32px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:28px;font-family:sans-serif">🏥 MediBook</h1>
      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-family:sans-serif">Your Health, Our Priority</p>
    </div>`;
    }
    footer() {
        return `<div style="background:#f8fafc;padding:20px;text-align:center;font-family:sans-serif;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0">
      <p>© ${new Date().getFullYear()} MediBook Technologies Pvt. Ltd. | support@medibook.in</p>
      <p>This is an automated message, please do not reply.</p>
    </div>`;
    }
    wrap(content) {
        return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f1f5f9;font-family:sans-serif">
      <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        ${this.header()}
        <div style="padding:32px">
          ${content}
        </div>
        ${this.footer()}
      </div>
    </body></html>`;
    }
    async sendBookingConfirmation(data) {
        const html = this.wrap(`
      <h2 style="color:#1e293b;margin:0 0 8px">Appointment Confirmed! 🎉</h2>
      <p style="color:#64748b;margin:0 0 24px">Your appointment has been successfully booked.</p>
      
      <div style="background:#eff8ff;border:1px solid #bfe3fd;border-radius:12px;padding:20px;margin-bottom:24px">
        <p style="margin:0 0 4px;font-size:12px;color:#1e6fe8;font-weight:600;text-transform:uppercase">Appointment No.</p>
        <p style="margin:0;font-size:20px;font-weight:700;color:#1e293b">${data.appointmentNo}</p>
      </div>
      
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        ${[
            ['👨‍⚕️ Doctor', `Dr. ${data.doctorName} (${data.speciality})`],
            ['📅 Date', data.date],
            ['🕐 Time', data.time],
            ['🏥 Clinic', data.clinicName],
            ['📍 Address', data.clinicAddress],
            ['💳 Payment', `${data.fee} via ${data.paymentMode}`],
        ].map(([label, value]) => `
          <tr>
            <td style="padding:10px 0;color:#64748b;font-size:14px;width:140px;border-bottom:1px solid #f1f5f9">${label}</td>
            <td style="padding:10px 0;color:#1e293b;font-size:14px;font-weight:600;border-bottom:1px solid #f1f5f9">${value}</td>
          </tr>`).join('')}
      </table>
      
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-bottom:24px">
        <p style="margin:0;color:#166534;font-size:14px">✅ Please arrive 10 minutes early. Bring any previous medical records if applicable.</p>
      </div>
      
      <p style="color:#64748b;font-size:14px">Need to cancel or reschedule? Log in to your MediBook account to manage your appointment.</p>
    `);
        await this.sendMail({ to: data.patientEmail, subject: `Appointment Confirmed - ${data.appointmentNo} | MediBook`, html });
    }
    async sendPaymentReceipt(data) {
        const html = this.wrap(`
      <h2 style="color:#1e293b;margin:0 0 8px">Payment Receipt 💳</h2>
      <p style="color:#64748b;margin:0 0 24px">Your payment has been successfully processed.</p>
      
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center">
        <p style="margin:0 0 4px;font-size:12px;color:#166534;font-weight:600">AMOUNT PAID</p>
        <p style="margin:0;font-size:36px;font-weight:800;color:#15803d">${data.amount}</p>
      </div>
      
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        ${[
            ['Payment ID', data.paymentId],
            ['Appointment', data.appointmentNo],
            ['Doctor', `Dr. ${data.doctorName}`],
            ['Date', data.date],
            ['Mode', data.mode],
            ['Status', '✅ PAID'],
        ].map(([label, value]) => `
          <tr>
            <td style="padding:10px 0;color:#64748b;font-size:14px;width:140px;border-bottom:1px solid #f1f5f9">${label}</td>
            <td style="padding:10px 0;color:#1e293b;font-size:14px;font-weight:600;border-bottom:1px solid #f1f5f9">${value}</td>
          </tr>`).join('')}
      </table>
      
      <p style="color:#94a3b8;font-size:12px">Keep this email as your payment receipt for future reference.</p>
    `);
        await this.sendMail({ to: data.email, subject: `Payment Receipt - ${data.amount} | MediBook`, html });
    }
    async sendVisitComplete(data) {
        const html = this.wrap(`
      <h2 style="color:#1e293b;margin:0 0 8px">Visit Complete! 🩺</h2>
      <p style="color:#64748b;margin:0 0 24px">Your consultation has been completed. Your prescription is ready.</p>
      
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        ${[
            ['Doctor', `Dr. ${data.doctorName} (${data.speciality})`],
            ['Date', data.date],
            ['Diagnosis', data.diagnosis || 'General Consultation'],
        ].map(([label, value]) => `
          <tr>
            <td style="padding:10px 0;color:#64748b;font-size:14px;width:140px;border-bottom:1px solid #f1f5f9">${label}</td>
            <td style="padding:10px 0;color:#1e293b;font-size:14px;font-weight:600;border-bottom:1px solid #f1f5f9">${value}</td>
          </tr>`).join('')}
      </table>
      
      <div style="background:#eff8ff;border:1px solid #bfe3fd;border-radius:12px;padding:16px;margin-bottom:24px">
        <p style="margin:0;color:#1e4fb0;font-size:14px">💊 Your digital prescription is available in your MediBook account. Log in to download it as PDF.</p>
      </div>
      
      <p style="color:#64748b;font-size:14px">Please follow the prescribed medicines and instructions. Take care! ❤️</p>
    `);
        await this.sendMail({ to: data.email, subject: `Visit Complete — Prescription Ready | MediBook`, html });
    }
    async sendOtp(email, otp, name) {
        const html = this.wrap(`
      <h2 style="color:#1e293b;margin:0 0 8px">Your OTP Code</h2>
      <p style="color:#64748b;margin:0 0 24px">Hello ${name}, use this OTP to verify your account:</p>
      <div style="background:#f1f5f9;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;letter-spacing:8px">
        <span style="font-size:40px;font-weight:800;color:#1e6fe8">${otp}</span>
      </div>
      <p style="color:#94a3b8;font-size:13px">This OTP expires in 10 minutes. Do not share it with anyone.</p>
    `);
        await this.sendMail({ to: email, subject: `OTP: ${otp} | MediBook Verification`, html });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map