export interface AvailabilitySlotResponse {
  startTime: string;
  endTime: string;
}

export interface ViewUpcomingAppointmentResponse {
  appointmentId: number;
  patientId: number;
  patientName: string;
  slot: AvailabilitySlotResponse;
  date: string;
}