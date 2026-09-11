export interface ReferralRequest {
  appointmentId: number;
  referredToDoctorId: number;
  reason: string;
  notes?: string;
}

export interface ReferralResponse {
  appointmentId: number;
  patientId: number;
  patientName: string;
  currentDoctorId: number;
  currentDoctorName: string;
  referredToDoctorId: number;
  referredToDoctorName: string;
  referralDetails: string;
  status: string;
  createdAt: string;
}

export interface DoctorOption {
  id: number;
  firstName: string;
  lastName: string;
  specialty?: string;
}
