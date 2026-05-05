import { apiClient } from './client';
import { ApiResponse } from '@/types';

export interface TranscribeResponse {
  transcript: string;
  languageDetected: string;
}

export interface ExtractSymptomsRequest {
  transcript: string;
}

export interface ExtractSymptomsResponse {
  chief_complaint: string;
  symptoms: Record<string, any>;
  red_flags_mentioned: string[];
  missing_information: string[];
  language_detected: string;
}

export interface GenerateQuestionsRequest {
  structuredSymptoms: Record<string, any>;
}

export interface GenerateQuestionsResponse {
  questions: string[];
}

export const aiApi = {
  async transcribeAudio(audioFile: File): Promise<ApiResponse<TranscribeResponse>> {
    const formData = new FormData();
    formData.append('file', audioFile);
    return apiClient.postFormData<ApiResponse<TranscribeResponse>>(
      '/api/ai/transcribe',
      formData
    );
  },

  async extractSymptoms(
    transcript: string
  ): Promise<ApiResponse<ExtractSymptomsResponse>> {
    return apiClient.post<ApiResponse<ExtractSymptomsResponse>>(
      '/api/ai/extract-symptoms',
      { transcript }
    );
  },

  async generateQuestions(
    structuredSymptoms: Record<string, any>
  ): Promise<ApiResponse<GenerateQuestionsResponse>> {
    return apiClient.post<ApiResponse<GenerateQuestionsResponse>>(
      '/api/ai/generate-questions',
      { structuredSymptoms }
    );
  },

  async generateDoctorSummary(data: any): Promise<ApiResponse<{ summary: string }>> {
    return apiClient.post<ApiResponse<{ summary: string }>>(
      '/api/ai/generate-doctor-summary',
      data
    );
  },

  async generatePatientAdvice(data: any): Promise<ApiResponse<{ advice: string }>> {
    return apiClient.post<ApiResponse<{ advice: string }>>(
      '/api/ai/generate-patient-advice',
      data
    );
  },
};
