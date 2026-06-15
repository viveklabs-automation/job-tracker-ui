// filepath: src/db/jobs.ts

import { dbPromise } from './index';
import type { Job, StatusHistoryEntry } from '../types';

export async function getAllJobs(): Promise<Job[]> {
  try {
    const db = await dbPromise;
    return await db.getAll('jobs');
  } catch (error) {
    console.error('Failed to get jobs from IndexedDB:', error);
    throw error;
  }
}

export async function getJob(id: string): Promise<Job | undefined> {
  try {
    const db = await dbPromise;
    return await db.get('jobs', id);
  } catch (error) {
    console.error(`Failed to get job ${id} from IndexedDB:`, error);
    throw error;
  }
}

export async function checkDuplicate(companyName: string, jobTitle: string, excludeId?: string): Promise<boolean> {
  try {
    const db = await dbPromise;
    const allJobs = await db.getAll('jobs');
    return allJobs.some(j => 
      !j.isArchived &&
      j.id !== excludeId &&
      j.companyName.trim().toLowerCase() === companyName.trim().toLowerCase() &&
      j.jobTitle.trim().toLowerCase() === jobTitle.trim().toLowerCase()
    );
  } catch (error) {
    console.error('Failed checking duplicates:', error);
    return false;
  }
}

export async function saveJob(job: Job): Promise<void> {
  try {
    const db = await dbPromise;
    
    // 1. Fetch existing job to check status history changes
    const existingJob = await db.get('jobs', job.id);
    
    let updatedHistory = [...(job.statusHistory || [])];
    
    if (existingJob) {
      // If status changed, push to history
      if (existingJob.statusId !== job.statusId) {
        const historyEntry: StatusHistoryEntry = {
          statusId: job.statusId,
          changedAt: Date.now()
        };
        updatedHistory.push(historyEntry);
      }
    } else {
      // New job, initialize status history if empty
      if (updatedHistory.length === 0) {
        updatedHistory.push({
          statusId: job.statusId,
          changedAt: Date.now()
        });
      }
    }
    
    // 2. Perform duplicate check
    const isDup = await checkDuplicate(job.companyName, job.jobTitle, job.id);
    
    const finalJob: Job = {
      ...job,
      isDuplicate: isDup,
      statusHistory: updatedHistory
    };
    
    await db.put('jobs', finalJob);
  } catch (error) {
    console.error('Failed to save job in IndexedDB:', error);
    throw error;
  }
}

export async function deleteJob(id: string): Promise<void> {
  try {
    const db = await dbPromise;
    await db.delete('jobs', id);
  } catch (error) {
    console.error(`Failed to delete job ${id} from IndexedDB:`, error);
    throw error;
  }
}
