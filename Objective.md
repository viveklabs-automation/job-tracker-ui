# RICEPOT Prompt — Local-First Job Tracker (React + Vite + IndexedDB)

---

## R — Role

You are an **Expert Senior Frontend Engineer** with deep expertise in React 18, Vite, and browser-native persistence (IndexedDB via the `idb` library). You design production-quality, accessible, performant single-page applications with a strong eye for modern UI/UX — inspired by tools like Linear, Notion, and GitHub Projects. You write clean, well-structured component code with zero bad practices and zero backend dependencies.

---

## I — Instructions

Follow these steps in order:

1. **Scaffold** a Vite + React (TypeScript) project with the folder structure below.
2. **Implement the IndexedDB layer** using the `idb` library. Create a `db.ts` module that opens the database, defines all object stores, and exports typed async CRUD functions for each entity.
3. **Build the data model** exactly as specified in the Context section — no deviations.
4. **Implement all UI screens and components** as described in the UI/UX section.
5. **Wire all interactions** — every button, drag-drop, filter, search, and status change must call the IndexedDB layer and re-render reactively.
6. **Apply the design language**: Modern Professional — minimalistic, card-based, soft shadows, rounded corners 10–12 px, subtle animations, no clutter, keyboard-friendly.
7. **Do NOT** add a backend, REST calls, authentication, localStorage (use IndexedDB only), or any external UI component library (use custom CSS/CSS Modules or Tailwind only).
8. **Do NOT** use class components; use only functional components with hooks.
9. **Do NOT** use `any` TypeScript types — fully type everything.
10. Implement Light/Dark mode via CSS custom properties toggled on `<html data-theme="dark">`.

**Folder structure to follow:**
```
src/
  db/
    index.ts          ← idb setup, store definitions
    jobs.ts           ← CRUD for Job entries
    statuses.ts       ← CRUD for custom statuses
    contacts.ts       ← CRUD for contacts
    tasks.ts          ← CRUD for tasks
    reminders.ts      ← CRUD for reminders
  components/
    layout/           ← Sidebar, MainWorkspace, InsightsPanel
    dashboard/        ← StatCards, TodayTasks, RecentActivity
    kanban/           ← Board, Column, JobCard, DragLayer
    jobDetail/        ← Drawer, Timeline, StatusHistory
    calendar/         ← MonthView, WeekView, DayView
    analytics/        ← Charts, DateFilter
    shared/           ← SearchBar, FilterBar, QuickAddFAB, NotificationCenter
  hooks/
    useJobs.ts
    useSearch.ts
    useFilters.ts
    useDragDrop.ts
  types/
    index.ts          ← All TypeScript interfaces
  styles/
    tokens.css        ← Design tokens (colors, spacing, radii, shadows)
    global.css
  App.tsx
  main.tsx
```

---

## C — Context

**What this app is:** A fully local, offline-first Job Application Tracker that runs entirely in the browser. All data is stored in IndexedDB. No server, no login. The user is a job seeker who wants to track every application, interview, and follow-up in one place — think a personal Jira/Trello, but purpose-built for job hunting.

**Target user:** A professional actively applying to multiple companies, managing 10–100+ applications simultaneously, wanting clarity on where each application stands.

**Tech environment:** Vite 5 + React 18 + TypeScript. `idb` (npm) for IndexedDB. `@dnd-kit/core` + `@dnd-kit/sortable` for drag-and-drop. `recharts` for analytics charts. No other major dependencies.

### Data Model

```typescript
// types/index.ts

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

**Default statuses (seeded on first launch in this order):**
Saved → Interested → Applied → Recruiter Screening → Assessment → Interview Scheduled → Interview Round 1 → Interview Round 2 → Final Round → Offer Received → Offer Accepted → Rejected → Withdrawn

---

## E — Example

### Example: idb setup (`db/index.ts`)
```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface JobTrackerDB extends DBSchema {
  jobs: { key: string; value: Job; indexes: { 'by-status': string; 'by-date': number } };
  statuses: { key: string; value: Status };
  contacts: { key: string; value: Contact };
  tasks: { key: string; value: Task; indexes: { 'by-job': string } };
  reminders: { key: string; value: Reminder };
}

export const dbPromise: Promise<IDBPDatabase<JobTrackerDB>> = openDB<JobTrackerDB>('job-tracker', 1, {
  upgrade(db) {
    const jobStore = db.createObjectStore('jobs', { keyPath: 'id' });
    jobStore.createIndex('by-status', 'statusId');
    jobStore.createIndex('by-date', 'dateAdded');
    db.createObjectStore('statuses', { keyPath: 'id' });
    db.createObjectStore('contacts', { keyPath: 'id' });
    const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
    taskStore.createIndex('by-job', 'jobId');
    db.createObjectStore('reminders', { keyPath: 'id' });
  },
});
```

### Example: Kanban JobCard component structure
```tsx
// components/kanban/JobCard.tsx
export function JobCard({ job, status }: { job: Job; status: Status }) {
  return (
    <div className="job-card" style={{ '--status-color': status.color } as React.CSSProperties}>
      <div className="job-card__header">
        <CompanyLogo name={job.companyName} />
        <PriorityBadge priority={job.priority} />
      </div>
      <h3 className="job-card__title">{job.jobTitle}</h3>
      <p className="job-card__company">{job.companyName}</p>
      <div className="job-card__meta">
        <DaysAgo timestamp={job.dateAdded} />
        {job.salaryRange && <span>{job.salaryRange}</span>}
        {job.resumeVersion && <span>Resume: {job.resumeVersion}</span>}
      </div>
      <div className="job-card__actions">/* Quick actions on hover */</div>
    </div>
  );
}
```

---

## P — Parameters

- **Code quality:** Production-level. Zero `any`, zero TODO comments left unimplemented, zero console.log statements in final code.
- **Performance:** Page load ≤ 2 s. Search results ≤ 300 ms (debounced). Drag-and-drop response ≤ 100 ms. Dashboard refresh ≤ 3 s.
- **Accessibility:** All interactive elements must have ARIA labels. Keyboard navigation must work throughout (Tab, Enter, Escape, arrow keys on Kanban).
- **Responsiveness:** Desktop (sidebar + workspace + insights), Tablet (sidebar + workspace), Mobile (bottom navigation + swipe gestures on cards).
- **Error handling:** All IndexedDB calls wrapped in try/catch with user-visible error toasts.
- **Empty states:** Every list/board view must show an illustrated empty state with a clear call-to-action when no data exists.
- **No external UI libraries** (no MUI, Chakra, Ant Design, etc.). Tailwind or CSS Modules only.

---

## O — Output

Produce the **complete, runnable source code** for the entire application. Deliver:

1. `package.json` — with all required dependencies (`idb`, `@dnd-kit/core`, `@dnd-kit/sortable`, `recharts`, `uuid`).
2. `vite.config.ts`
3. `src/types/index.ts` — all TypeScript interfaces.
4. `src/db/index.ts` — idb schema and `dbPromise`.
5. `src/db/jobs.ts`, `statuses.ts`, `contacts.ts`, `tasks.ts`, `reminders.ts` — typed CRUD modules.
6. `src/styles/tokens.css` — CSS custom properties for both light and dark themes.
7. All component files under `src/components/` as listed in the folder structure.
8. All hook files under `src/hooks/`.
9. `src/App.tsx` and `src/main.tsx`.

Output **only code files**. No prose explanations between files. Each file begins with a comment line: `// filepath: src/...`

---

## T — Tone

**Technical. Precise. Code-only.**
Respond as a senior engineer committing production code — no filler, no hedging, no explanations unless a non-obvious architectural decision must be noted in a single inline comment. Every line of code should look like it belongs in a real shipped product.