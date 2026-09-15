import { TechnicianProfile, UserProfile, ServiceLead, Review, AdminAuditLog } from '../types';

export const ADMIN_PHONE_NUMBER = '8092805945';

// Zero mock profiles: app operates strictly on live Supabase database records
export const INITIAL_USERS: UserProfile[] = [];
export const INITIAL_TECHNICIANS: TechnicianProfile[] = [];
export const INITIAL_LEADS: ServiceLead[] = [];
export const INITIAL_REVIEWS: Review[] = [];
export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [];
