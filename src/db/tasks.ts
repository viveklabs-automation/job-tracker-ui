// filepath: src/db/tasks.ts

import { dbPromise } from './index';
import type { Task } from '../types';

export async function getAllTasks(): Promise<Task[]> {
  try {
    const db = await dbPromise;
    return await db.getAll('tasks');
  } catch (error) {
    console.error('Failed to get tasks from IndexedDB:', error);
    throw error;
  }
}

export async function getTasksForJob(jobId: string): Promise<Task[]> {
  try {
    const db = await dbPromise;
    return await db.getAllFromIndex('tasks', 'by-job', jobId);
  } catch (error) {
    console.error(`Failed to get tasks for job ${jobId} from IndexedDB:`, error);
    throw error;
  }
}

export async function saveTask(task: Task): Promise<void> {
  try {
    const db = await dbPromise;
    await db.put('tasks', task);
  } catch (error) {
    console.error('Failed to save task in IndexedDB:', error);
    throw error;
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    const db = await dbPromise;
    await db.delete('tasks', id);
  } catch (error) {
    console.error(`Failed to delete task ${id} from IndexedDB:`, error);
    throw error;
  }
}
