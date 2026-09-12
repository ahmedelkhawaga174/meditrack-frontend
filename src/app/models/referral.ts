export interface DoctorPatient {
  appointmentId: number;
  patientId: number;
  patientName: string;
  appointmentDate: string;
  appointmentStatus: string;
}

export interface ReferralRequest {
  appointmentId: number;
  referredToDoctorId: number;
  referralReason: string;
}

export interface DoctorOption {
  id: number;
  firstName: string;
  lastName: string;
  specialty?: string;
}

export interface ReferralResponse {
  id: number;
  appointmentId: number;
  patientId: number;
  patientName: string;
  referringDoctorId: number;
  referringDoctorName: string;
  referredToDoctorId: number;
  referredToDoctorName: string;
  referralReason: string;
  status: string;
  createdAt: string;
}
