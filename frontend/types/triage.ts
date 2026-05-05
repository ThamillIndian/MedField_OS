// Triage Types
export type RiskLevel = 'green' | 'amber' | 'red';

export interface TriageResult {
  id: string;
  visitId: string;
  patientId: string;
  workerId: string;
  riskLevel: RiskLevel;
  riskScore: number;
  possibleConditions: string[];
  reasons: string[];
  nextSteps: string[];
  ruleTriggers: string[];
  llmExplanation: string;
  createdAt: Date;
}
