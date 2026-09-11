export interface ConsultationResponse {
  appointmentId: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  status: string;
  notes: string;
  createdAt: string;
}

export interface RecordDiagnosisRequest {
  diagnosis: string;
  notes?: string;
}

export interface DiagnosisResponse {
  appointmentId: number;
  patientId: number;
  patientName: string;
  diagnosis: string;
  notes: string;
  updatedAt: string;
}
