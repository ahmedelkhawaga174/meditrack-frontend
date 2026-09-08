export interface ConsultationRecord {
  appointmentId: number;
  doctorName: string;
  specialization: string;
  date: string;
  diagnosis: string;
  prescription: string;
  notes: string;
}

export interface MedicalHistoryResponse {
  patientId: number;
  patientName: string;
  history: ConsultationRecord[];
}
