
export enum GrievanceStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
}

export enum GrievancePriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

export enum GrievanceCategory {
  WATER = 'Water Supply',
  ROADS = 'Roads & Infrastructure',
  ELECTRICITY = 'Street Lights/Electricity',
  SANITATION = 'Sanitation/Cleaning',
  HOUSING = 'Housing Scheme (PMAY)',
  PENSION = 'Pension',
  OTHER = 'Other',
}

export interface GrievanceAction {
  id: string;
  type: 'STATUS_CHANGE' | 'NOTE' | 'EVENT_LINKED';
  description: string;
  date: string; // ISO String
}

export interface Grievance {
  id: string;
  citizenName: string;
  mobile: string;
  category: GrievanceCategory;
  description: string;
  status: GrievanceStatus;
  priority: GrievancePriority;
  dateLogged: string;
  wardNumber: string;
  actions: GrievanceAction[];
}

export enum EventType {
  VISIT = 'Site Visit',
  MEETING = 'Meeting',
  SABHA = 'Gram Sabha',
  OTHER = 'Other'
}

export enum EventStatus {
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  POSTPONED = 'Postponed'
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: EventType;
  grievanceId?: string; // Optional link to a grievance
  status: EventStatus;
  notes?: string;
}

export interface SchemeInfo {
  name: string;
  description: string;
  eligibility: string[];
  documentsRequired: string[];
}

export type TabView = 'DASHBOARD' | 'GRIEVANCES' | 'SCHEDULE' | 'DRAFTER' | 'SCHEMES' | 'CONNECT';

export type Language = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'pa';
