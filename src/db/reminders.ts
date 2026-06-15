// filepath: src/db/reminders.ts

import { dbPromise } from './index';
import type { Reminder } from '../types';

export async function getAllReminders(): Promise<Reminder[]> {
  try {
    const db = await dbPromise;
    return await db.getAll('reminders');
  } catch (error) {
    console.error('Failed to get reminders from IndexedDB:', error);
    throw error;
  }
}

export async function saveReminder(reminder: Reminder): Promise<void> {
  try {
    const db = await dbPromise;
    await db.put('reminders', reminder);
  } catch (error) {
    console.error('Failed to save reminder in IndexedDB:', error);
    throw error;
  }
}

export async function deleteReminder(id: string): Promise<void> {
  try {
    const db = await dbPromise;
    await db.delete('reminders', id);
  } catch (error) {
    console.error(`Failed to delete reminder ${id} from IndexedDB:`, error);
    throw error;
  }
}
