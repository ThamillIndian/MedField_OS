// Patient Types
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  village: string;
  district: string;
  knownConditions: string[];
  createdByWorkerId: string;
  linkedUserId?: string;
  status: 'under_monitoring' | 'stable' | 'critical' | 'discharged';
  latestRiskLevel: 'green' | 'amber' | 'red' | null;
  createdAt: Date;
  updatedAt: Date;
}
