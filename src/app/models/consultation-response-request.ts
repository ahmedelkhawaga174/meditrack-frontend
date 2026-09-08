export interface ConsultationRequest {
  appointmentId: string;
  notes: string;
}

export interface ConsultationResponse {
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  status: string;
  notes: string;
  createdAt: string;
}
