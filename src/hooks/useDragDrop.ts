// filepath: src/hooks/useDragDrop.ts

import type { DragEndEvent } from '@dnd-kit/core';
import type { Job, Status } from '../types';

export function useDragDrop(
  jobs: Job[],
  statuses: Status[],
  onUpdateJobStatus: (jobId: string, newStatusId: string) => Promise<void>
) {
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      return;
    }

    const jobId = active.id as string;
    const overId = over.id as string;

    let targetStatusId: string | null = null;

    // 1. Check if the over element is a Column ID (Status ID)
    const isStatusColumn = statuses.some(s => s.id === overId);
    if (isStatusColumn) {
      targetStatusId = overId;
    } else {
      // 2. Check if the over element is a Job Card ID
      const overJob = jobs.find(j => j.id === overId);
      if (overJob) {
        targetStatusId = overJob.statusId;
      }
    }

    // 3. Update the job status if it changed
    if (targetStatusId) {
      const draggedJob = jobs.find(j => j.id === jobId);
      if (draggedJob && draggedJob.statusId !== targetStatusId) {
        try {
          await onUpdateJobStatus(jobId, targetStatusId);
        } catch (error) {
          console.error('Failed to update job status on drag-drop:', error);
        }
      }
    }
  };

  return {
    handleDragEnd
  };
}
