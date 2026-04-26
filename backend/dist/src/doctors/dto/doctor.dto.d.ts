export declare class DoctorFilterDto {
    specialityId?: string;
    clinicId?: string;
    city?: string;
    minFee?: number;
    maxFee?: number;
    minExperience?: number;
    rating?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
}
export declare class CreateDoctorDto {
    userId: string;
    specialityId: string;
    registrationNo?: string;
    experience?: number;
    about?: string;
    education?: any[];
    languages?: string[];
    consultationFee?: number;
    followUpFee?: number;
}
export declare class UpdateDoctorDto {
    experience?: number;
    about?: string;
    education?: any[];
    languages?: string[];
    consultationFee?: number;
    followUpFee?: number;
}
