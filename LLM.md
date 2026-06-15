# Project Constitution: LLM.md

## Data Schemas

```typescript
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
export type Priority = 'High' | 'Medium' | 'Low';

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

export interface StatusHistoryEntry {
  statusId: string;
  changedAt: number;             // timestamp
  note?: string;
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
```

### Seed Data
Default statuses to be seeded on database creation:
1. `Saved`
2. `Interested`
3. `Applied`
4. `Recruiter Screening`
5. `Assessment`
6. `Interview Scheduled`
7. `Interview Round 1`
8. `Interview Round 2`
9. `Final Round`
10. `Offer Received`
11. `Offer Accepted`
12. `Rejected`
13. `Withdrawn`

---

## Architectural Invariants
1. **Local-first browser database**: Strictly use IndexedDB (`idb` package).
2. **Zero backend**: Do not add a database backend or mock backend server. No external API endpoints for persisting data.
3. **No client authentication**: Entire app is unlocked and available immediately.
4. **No external UI libraries**: Use custom CSS and components. Tailwind is allowed if needed (or custom CSS, which is preferred for flexibility/custom styling). We will use custom CSS/CSS Modules for layout and aesthetics.
5. **No class-based components**: Use only functional components with hooks.
6. **No typescript `any`**: Ensure strict type checking across the entire project.

---

## Behavioral Rules
1. **Performance**: Web page loads under 2 seconds. Debounced searches finish under 300 ms.
2. **Aesthetics**: Premium, modern, minimalistic, glassmorphic or card-based styling, dark and light modes supported via CSS variables toggled on the HTML element.
3. **Error boundaries**: Wrap all IDB transactions and operations in try-catch blocks and present errors with toast notifications.
4. **Empty states**: Illustrated or stylized empty states for every page/view.

---

## Maintenance Log
* 2026-06-15: Initialized LLM.md from Objective.md specifications.
