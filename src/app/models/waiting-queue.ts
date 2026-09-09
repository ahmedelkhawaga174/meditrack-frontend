export type QueueStatus =
  | 'WAITING'
  | 'CALLED'
  | 'IN_CONSULTATION'
  | 'COMPLETED'
  | 'CANCELLED';

export interface WaitingQueue {
  id: number;
  appointmentId: number;
  patientId: number;
  doctorId: number;
  queuePosition: number;
  status: QueueStatus;
  checkedInAt: string;
}
