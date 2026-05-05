// Visit and Symptoms Types
export interface StructuredSymptoms {
  [key: string]: boolean | number | string | null;
}

export interface Vitals {
  temperature?: number | null;
  bpSystolic?: number | null;
  bpDiastolic?: number | null;
  pulse?: number | null;
  spo2?: number | null;
  bloodSugar?: number | null;
  weight?: number | null;
}

export interface Visit {
  id: string;
  patientId: string;
  workerId: string;
  visitType: 'new' | 'followup';
  chiefComplaint: string;
  rawTranscript?: string;
  languageDetected?: string;
  structuredSymptoms: StructuredSymptoms;
  aiQuestions?: string[];
  aiAnswers?: Record<string, string>;
  vitals: Vitals;
  status: 'started' | 'triaged' | 'referred' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
