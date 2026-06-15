# Task Plan — Local-First Job Tracker

This task plan follows the BLAST framework and details the building blocks and phases of the project.

## Phase 1: Blueprint
- [x] Analyze `Objective.md` and `B.L.A.S.T.md` requirements.
- [x] Initialize Project Memory (`LLM.md`, `task_plan.md`, `findings.md`, `progress.md`).
- [x] Present Blueprint & ask discovery questions to the user.
- [x] Align on data schemas and final user requirements.

## Phase 2: Link
- [x] Create/verify project structure.
- [x] Initialize Vite + React (TypeScript) project.
- [x] Install dependencies (`idb`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `recharts`, `uuid`, `lucide-react`).
- [x] Verify dependencies are linked and project builds.

## Phase 3: Architect
- [x] Implement `src/db/index.ts` (IndexedDB open, upgrade, default seed).
- [x] Implement CRUD modules under `src/db/` (`jobs.ts`, `statuses.ts`, `contacts.ts`, `tasks.ts`, `reminders.ts`).
- [x] Implement shared state custom hooks (`useJobs.ts`, `useSearch.ts`, `useFilters.ts`, `useDragDrop.ts`).
- [x] Set up design system & global CSS (`src/styles/tokens.css`, `src/styles/global.css`).
- [x] Build shared UI components (`SearchBar.tsx`, `FilterBar.tsx`, `QuickAddFAB.tsx`, `NotificationCenter.tsx`).
- [x] Build core layouts (`Sidebar.tsx`, `MainWorkspace.tsx`, `InsightsPanel.tsx`).
- [x] Build page-level components:
  - [x] Dashboard View (`StatCards.tsx`, `TodayTasks.tsx`, `RecentActivity.tsx`).
  - [x] Kanban View (`Board.tsx`, `Column.tsx`, `JobCard.tsx`).
  - [x] Job Detail Drawer (`Drawer.tsx`, `Timeline.tsx`, `StatusHistory.tsx`).
  - [x] Calendar View (`MonthView.tsx`, `WeekView.tsx`, `DayView.tsx`).
  - [x] Analytics View (`Charts.tsx`, `DateFilter.tsx`).

## Phase 4: Stylize
- [x] Review UI accessibility, keyboard controls, and responsive styling.
- [x] Polish transitions, animations, hover states, glassmorphism, and color harmony.
- [x] Implement error boundary states and illustrated empty state UI.
- [x] Support seamless Dark / Light modes via CSS Custom Properties.

## Phase 5: Trigger
- [x] Verify full build succeeds.
- [x] Demonstrate working UI, drag-and-drop, filter options, and offline persistence.
- [x] Finalize documentation and update maintenance log.
