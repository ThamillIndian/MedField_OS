// Re-export all types
export * from './user';
export * from './patient';
export * from './visit';
export * from './triage';
export * from './referral';

// Common API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
