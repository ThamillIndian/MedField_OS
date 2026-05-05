import { RiskLevel } from '@/types';

export const constants = {
  APP_NAME: 'MedField OS',
  APP_TAGLINE: 'AI Clinical Copilot for Rural Healthcare',
  
  ROLES: {
    WORKER: 'worker',
    DOCTOR: 'doctor',
    PATIENT: 'patient',
    ADMIN: 'admin',
  },

  RISK_LEVELS: {
    GREEN: 'green' as RiskLevel,
    AMBER: 'amber' as RiskLevel,
    RED: 'red' as RiskLevel,
  },

  RISK_COLORS: {
    green: '#10B981', // Tailwind green-500
    amber: '#F59E0B', // Tailwind amber-500
    red: '#EF4444',   // Tailwind red-500
  },

  RISK_LABELS: {
    green: 'Low Risk',
    amber: 'Moderate Risk',
    red: 'Urgent Risk',
  },

  VISIT_TYPES: {
    NEW: 'new',
    FOLLOWUP: 'followup',
  },

  REFERRAL_STATUS: {
    PENDING: 'pending',
    REVIEWED: 'reviewed',
    CLOSED: 'closed',
    ESCALATED: 'escalated',
  },
};

export default constants;
