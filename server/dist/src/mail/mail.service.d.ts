export declare class MailService {
    private readonly logger;
    private transporter;
    constructor();
    private sendMail;
    private header;
    private footer;
    private wrap;
    sendBookingConfirmation(data: {
        patientEmail: string;
        patientName: string;
        doctorName: string;
        speciality: string;
        clinicName: string;
        clinicAddress: string;
        date: string;
        time: string;
        appointmentNo: string;
        fee: string;
        paymentMode: string;
    }): Promise<void>;
    sendPaymentReceipt(data: {
        email: string;
        name: string;
        amount: string;
        paymentId: string;
        appointmentNo: string;
        doctorName: string;
        date: string;
        mode: string;
    }): Promise<void>;
    sendVisitComplete(data: {
        email: string;
        patientName: string;
        doctorName: string;
        speciality: string;
        date: string;
        diagnosis: string;
        prescriptionId: string;
    }): Promise<void>;
    sendOtp(email: string, otp: string, name: string): Promise<void>;
}
