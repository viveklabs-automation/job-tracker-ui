// filepath: src/db/index.ts

import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Job, Status, Contact, Task, Reminder } from '../types';

export interface JobTrackerDB extends DBSchema {
  jobs: { 
    key: string; 
    value: Job; 
    indexes: { 'by-status': string; 'by-date': number } 
  };
  statuses: { 
    key: string; 
    value: Status 
  };
  contacts: { 
    key: string; 
    value: Contact 
  };
  tasks: { 
    key: string; 
    value: Task; 
    indexes: { 'by-job': string } 
  };
  reminders: { 
    key: string; 
    value: Reminder 
  };
}

const DEFAULT_STATUSES: Omit<Status, 'id'>[] = [
  { label: 'Saved', color: '#64748b', order: 1, isDefault: true },
  { label: 'Interested', color: '#0ea5e9', order: 2, isDefault: false },
  { label: 'Applied', color: '#6366f1', order: 3, isDefault: false },
  { label: 'Recruiter Screening', color: '#f59e0b', order: 4, isDefault: false },
  { label: 'Assessment', color: '#8b5cf6', order: 5, isDefault: false },
  { label: 'Interview Scheduled', color: '#10b981', order: 6, isDefault: false },
  { label: 'Interview Round 1', color: '#10b981', order: 7, isDefault: false },
  { label: 'Interview Round 2', color: '#10b981', order: 8, isDefault: false },
  { label: 'Final Round', color: '#059669', order: 9, isDefault: false },
  { label: 'Offer Received', color: '#ec4899', order: 10, isDefault: false },
  { label: 'Offer Accepted', color: '#d946ef', order: 11, isDefault: false },
  { label: 'Rejected', color: '#ef4444', order: 12, isDefault: false },
  { label: 'Withdrawn', color: '#6b7280', order: 13, isDefault: false }
];

export const dbPromise: Promise<IDBPDatabase<JobTrackerDB>> = openDB<JobTrackerDB>('job-tracker', 1, {
  upgrade(db, _oldVersion, _newVersion, transaction) {
    // 1. Create stores
    if (!db.objectStoreNames.contains('jobs')) {
      const jobStore = db.createObjectStore('jobs', { keyPath: 'id' });
      jobStore.createIndex('by-status', 'statusId');
      jobStore.createIndex('by-date', 'dateAdded');
    }
    
    if (!db.objectStoreNames.contains('statuses')) {
      db.createObjectStore('statuses', { keyPath: 'id' });
    }
    
    if (!db.objectStoreNames.contains('contacts')) {
      db.createObjectStore('contacts', { keyPath: 'id' });
    }
    
    if (!db.objectStoreNames.contains('tasks')) {
      const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
      taskStore.createIndex('by-job', 'jobId');
    }
    
    if (!db.objectStoreNames.contains('reminders')) {
      db.createObjectStore('reminders', { keyPath: 'id' });
    }

    // 2. Seed statuses
    const statusStore = transaction.objectStore('statuses');
    DEFAULT_STATUSES.forEach((s) => {
      // Create a deterministic UUID/id based on order/label or generate simple unique ID
      const statusId = `status-${s.order}`;
      statusStore.put({
        id: statusId,
        ...s
      });
    });
  },
});
