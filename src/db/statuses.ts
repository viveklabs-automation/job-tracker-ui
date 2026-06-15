// filepath: src/db/statuses.ts

import { dbPromise } from './index';
import type { Status } from '../types';

export async function getAllStatuses(): Promise<Status[]> {
  try {
    const db = await dbPromise;
    const statuses = await db.getAll('statuses');
    return statuses.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Failed to get statuses from IndexedDB:', error);
    throw error;
  }
}

export async function getStatus(id: string): Promise<Status | undefined> {
  try {
    const db = await dbPromise;
    return await db.get('statuses', id);
  } catch (error) {
    console.error(`Failed to get status ${id} from IndexedDB:`, error);
    throw error;
  }
}

export async function saveStatus(status: Status): Promise<void> {
  try {
    const db = await dbPromise;
    await db.put('statuses', status);
  } catch (error) {
    console.error('Failed to save status in IndexedDB:', error);
    throw error;
  }
}

export async function deleteStatus(id: string): Promise<void> {
  try {
    const db = await dbPromise;
    await db.delete('statuses', id);
  } catch (error) {
    console.error(`Failed to delete status ${id} from IndexedDB:`, error);
    throw error;
  }
}
