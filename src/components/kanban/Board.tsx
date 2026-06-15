// filepath: src/components/kanban/Board.tsx

import React, { useState } from 'react';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { useJobs } from '../../hooks/useJobs';
import { useFilters } from '../../hooks/useFilters';
import { useSearch } from '../../hooks/useSearch';
import { useDragDrop } from '../../hooks/useDragDrop';
import { Column } from './Column';
import { JobCard } from './JobCard';
import { SearchBar } from '../shared/SearchBar';
import { FilterBar } from '../shared/FilterBar';
import './kanban.css';

interface BoardProps {
  onJobClick: (id: string) => void;
}

export const Board: React.FC<BoardProps> = ({ onJobClick }) => {
  const { jobs, statuses, updateJob } = useJobs();
  const [searchQuery, setSearchQuery] = useState('');
  
  // 1. Get filtered jobs
  const { filters, setFilters, filteredJobs, clearFilters } = useFilters(jobs);
  
  // 2. Get searched jobs
  const processedJobs = useSearch(filteredJobs, searchQuery);
  
  // Filter out archived jobs for the board view
  const activeJobs = processedJobs.filter(j => !j.isArchived);

  // 3. Status Drag and Drop
  const handleUpdateJobStatus = async (jobId: string, newStatusId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      await updateJob({
        ...job,
        statusId: newStatusId
      });
    }
  };

  const [activeId, setActiveId] = useState<string | null>(null);

  const { handleDragEnd } = useDragDrop(
    jobs,
    statuses,
    handleUpdateJobStatus
  );

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleCustomDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    await handleDragEnd(event);
  };

  const activeJob = activeId ? jobs.find(j => j.id === activeId) : null;
  const activeStatus = activeJob ? statuses.find(s => s.id === activeJob.statusId) : null;

  return React.createElement(
    'div',
    { className: 'kanban' },
    [
      // Controls
      React.createElement(
        'div',
        { className: 'kanban__controls', key: 'controls' },
        [
          React.createElement(SearchBar, {
            value: searchQuery,
            onChange: setSearchQuery,
            placeholder: 'Search board by title, company, notes...',
            key: 'search'
          }),
          React.createElement(FilterBar, {
            filters: filters,
            onFilterChange: setFilters,
            onClear: clearFilters,
            key: 'filters'
          })
        ]
      ),

      // Dnd Context wrapper
      React.createElement(
        DndContext,
        {
          sensors: sensors,
          onDragStart: handleDragStart,
          onDragEnd: handleCustomDragEnd,
          key: 'dnd-context'
        },
        [
          React.createElement(
            'div',
            { className: 'kanban__board', key: 'board' },
            statuses.map(status => {
              const columnJobs = activeJobs.filter(j => j.statusId === status.id);
              return React.createElement(Column, {
                key: status.id,
                status: status,
                jobs: columnJobs,
                onJobClick: onJobClick
              });
            })
          ),
          React.createElement(
            DragOverlay,
            { key: 'drag-overlay' },
            activeJob && activeStatus ? React.createElement(JobCard, {
              job: activeJob,
              status: activeStatus,
              onClick: onJobClick,
              isOverlay: true
            }) : null
          )
        ]
      )
    ]
  );
};
export default Board;
