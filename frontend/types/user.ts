// User and Role Types
export type UserRole = 'worker' | 'doctor' | 'patient' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  linkedPatientId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser extends User {
  token: string;
}
