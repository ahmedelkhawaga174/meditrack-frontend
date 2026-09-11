export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  type?: string;
  id?: number;
  username?: string;
  email?: string;
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