export type SlotStatus =
  | 'AVAILABLE'
  | 'BOOKED'
  | 'BLOCKED'
  | 'CANCELLED';

export interface AvailabilitySlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
}

export interface CreateAvailabilityRequest {
  date: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
}