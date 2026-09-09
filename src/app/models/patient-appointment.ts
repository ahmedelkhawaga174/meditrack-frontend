export interface PatientAppointment {
  appointmentId: number;
  doctorName: string;
  specialization: string;
  departmentName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'  | 'CHECKED_IN';
  notes: string | null;
}
