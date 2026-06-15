// filepath: src/types/index.ts

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
export type Priority = 'High' | 'Medium' | 'Low';

export interface StatusHistoryEntry {
  statusId: string;
  changedAt: number;             // timestamp
  note?: string;
}

export interface Job {
  id: string;                    // uuid
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  jobDescription?: string;
  employmentType?: EmploymentType;
  location?: string;
  salaryRange?: string;
  sourcePlatform?: string;
  dateAdded: number;             // Date.now() timestamp
  statusId: string;              // FK → Status.id
  priority: Priority;
  resumeVersion?: string;
  recruiterId?: string;          // FK → Contact.id (optional)
  notes?: string;
  isArchived: boolean;
  isDuplicate: boolean;
  statusHistory: StatusHistoryEntry[];
}

export interface Status {
  id: string;
  label: string;
  color: string;                 // hex
  order: number;
  isDefault: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;                 // e.g. "Recruiter", "Hiring Manager"
  companyName?: string;
  linkedIn?: string;
  notes?: string;
}

export interface Task {
  id: string;
  jobId?: string;                // optional link to a job
  title: string;
  dueDate?: number;
  isDone: boolean;
  createdAt: number;
}

export interface Reminder {
  id: string;
  jobId?: string;
  title: string;
  scheduledAt: number;
  isSnoozed: boolean;
  snoozeUntil?: number;
  isRead: boolean;
}
