import { apiClient } from './client';
import { ApiResponse, TriageResult, Vitals } from '@/types';

export interface RunTriageRequest {
  visitId: string;
  patientId: string;
  workerId: string;
  structuredSymptoms: Record<string, any>;
  vitals: Vitals;
}

export const triageApi = {
  async runTriage(data: RunTriageRequest): Promise<ApiResponse<TriageResult>> {
    return apiClient.post<ApiResponse<TriageResult>>('/api/triage/run', data);
  },

  async getTriageResult(triageId: string): Promise<ApiResponse<TriageResult>> {
    return apiClient.get<ApiResponse<TriageResult>>(`/api/triage/${triageId}`);
  },
};
