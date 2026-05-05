// Referral Types
export type ReferralStatus = 'pending' | 'reviewed' | 'closed' | 'escalated';
export type ReferralPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Referral {
  id: string;
  patientId: string;
  visitId: string;
  triageId: string;
  workerId: string;
  doctorId: string;
  riskLevel: RiskLevel;
  reason: string;
  status: ReferralStatus;
  priority: ReferralPriority;
  createdAt: Date;
  reviewedAt?: Date | null;
  closedAt?: Date | null;
}

export interface ClinicalNote {
  id: string;
  referralId: string;
  patientId: string;
  doctorId: string;
  diagnosisNote: string;
  prescription: Prescription[];
  testsRequired: string[];
  doctorDecision: 'keep_monitoring' | 'discharge' | 'escalate';
  createdAt: Date;
}

export interface Prescription {
  name: string;
  dosage: string;
  duration: string;
}
