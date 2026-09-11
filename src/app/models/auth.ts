export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  patientId: number | null;
  phone: string;
  role: string;
  lastLoginAt: string;
  message: string;
}

export interface RegisterRequest {
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
}

export interface RegisterResponse {
  patientId: number;
  phone: string;
  message: string;
}