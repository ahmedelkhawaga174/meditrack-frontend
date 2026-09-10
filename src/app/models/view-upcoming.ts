export interface AvailabilitySlotResponse {
  startTime: string;
  endTime: string;
}

export interface ViewUpcomingAppointmentResponse {
  patientId: number;
  patientName: string;
  slot: AvailabilitySlotResponse;
  date: string;
}
