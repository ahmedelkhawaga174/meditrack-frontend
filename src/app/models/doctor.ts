export interface SlotResponse {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface DoctorResponse {
  id: number;
  firstName: string;
  lastName: string;
  specialization: string;
  departmentId: number;
  departmentName: string;
  availableSlots: SlotResponse[];
}

export interface DepartmentOption {
  id: number;
  name: string;
}
