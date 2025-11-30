
/**
 * Data Models & Type Definitions
 * ------------------------------
 * This file defines the core schema for the application.
 * All interfaces are designed to be JSON-serializable for easy storage in localStorage.
 */

// --- Grievance Module ---

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

/**
 * Represents an audit trail entry for a grievance.
 * Used to track history of changes for accountability.
 */
export interface GrievanceAction {
  id: string;
  type: 'STATUS_CHANGE' | 'NOTE' | 'EVENT_LINKED';
  description: string;
  date: string; // ISO String (YYYY-MM-DDTHH:mm:ss.sssZ)
}

/**
 * The core entity representing a complaint or issue log.
 */
export interface Grievance {
  id: string; // Unique ID (Timestamp or UUID)
  citizenName: string;
  mobile: string;
  category: GrievanceCategory;
  description: string;
  status: GrievanceStatus;
  priority: GrievancePriority;
  dateLogged: string; // YYYY-MM-DD
  wardNumber: string;
  actions: GrievanceAction[]; // History of actions taken
}

// --- Schedule/Calendar Module ---

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

/**
 * Represents a calendar entry. Can be linked to a grievance.
 */
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: EventType;
  /**
   * Optional Link:
   * If this event was created to address a specific grievance (e.g., site visit),
   * this ID links back to the Grievance entity.
   */
  grievanceId?: string; 
  status: EventStatus;
  notes?: string;
}

// --- AI & Content ---

export interface SchemeInfo {
  name: string;
  description: string;
  eligibility: string[];
  documentsRequired: string[];
}

// --- User & Config ---

export interface UserProfile {
  name: string;
  wardNumber: string;
  panchayatName: string;
  mobile: string;
}

/**
 * Configuration for App Security.
 * Stored in localStorage to persist lock settings.
 */
export interface SecurityConfig {
  isEnabled: boolean;
  method: 'PIN' | 'BIOMETRIC';
  pin: string; // 4 digit pin (used if method is PIN)
  credentialId?: string; // Base64 string for WebAuthn credential ID (if biometric)
}

// --- UI State ---

export type TabView = 'DASHBOARD' | 'GRIEVANCES' | 'SCHEDULE' | 'DRAFTER' | 'SCHEMES' | 'CONNECT' | 'SETTINGS';

export type Language = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'pa';

export type AppTheme = 'light' | 'dark' | 'midnight';
