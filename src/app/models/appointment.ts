export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'CHECKED_IN';

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  slotId: number;
  status: AppointmentStatus;
  createdAt: string;
  notes: string | null;
}
