# Findings — Local-First Job Tracker

## Constraints & Requirements
1. **No Backend**: The application is client-side only. All database records live in browser IndexedDB.
2. **Offline-First**: Uses native storage so it works entirely offline.
3. **No External UI Component Libraries**: We must design custom layout components (e.g. Modals, Drawers, Date pickers, Kanban boards) using vanilla CSS, React, and `@dnd-kit`. Libraries like Material-UI, Tailwind UI components, or Chakra are forbidden. Custom CSS Modules or pure Tailwind CSS classes can be used. We will use Custom CSS modules/files mapped to a cohesive tokens system in `tokens.css`.
4. **Typing Integrity**: Must have zero `any` declarations in the codebase.
5. **Seeding Requirement**: Default statuses must be generated when the IndexedDB database is initialized/upgraded.

## Tech Stack Analysis
- **Build Tool**: Vite (very fast dev server and production builder).
- **Core Library**: React 18 with TypeScript.
- **Database Library**: `idb` wrapper for IndexedDB (standard, lightweight, promise-based API).
- **Drag and Drop**: `@dnd-kit` is modular and performant, which fits the ≤ 100ms response requirement for Kanban cards.
- **Analytics Charts**: `recharts` is reactive, SVG-based, and fits easily into React apps.

## Key Design Considerations
- **Theme custom properties**: CSS custom properties toggled on `document.documentElement` (`data-theme="dark"` / `data-theme="light"`).
- **Smooth animations**: Cards should animate when dragged, menus should fade in, drawer should slide in/out.
- **Accessible keyboard support**: Interactive buttons must have ARIA labels, board column lists should support Tab/Enter and escaping details/dialogs.
