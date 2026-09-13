export interface PrescriptionRequest {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface PatientPrescriptionResponse {
  prescriptionId: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  issuedDate: string;
  prescribingDoctor: string;
}