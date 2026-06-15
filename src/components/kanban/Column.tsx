// filepath: src/components/kanban/Column.tsx

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Status, Job } from '../../types';
import { JobCard } from './JobCard';
import './kanban.css';

interface ColumnProps {
  status: Status;
  jobs: Job[];
  onJobClick: (id: string) => void;
}

export const Column: React.FC<ColumnProps> = ({ status, jobs, onJobClick }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status.id
  });

  const columnStyle = {
    '--column-color': status.color
  } as React.CSSProperties;

  return React.createElement(
    'div',
    {
      ref: setNodeRef,
      style: columnStyle,
      className: `kanban__column ${isOver ? 'kanban__column--dragging-over' : ''}`
    },
    [
      // Column Header
      React.createElement(
        'div',
        { className: 'kanban__column-header', key: 'header' },
        [
          React.createElement(
            'div',
            { className: 'kanban__column-title-wrapper', key: 'title-wrapper' },
            [
              React.createElement(
                'span',
                { 
                  style: { 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: status.color, 
                    display: 'inline-block' 
                  },
                  key: 'dot' 
                }
              ),
              React.createElement('span', { className: 'kanban__column-title', key: 'title' }, status.label)
            ]
          ),
          React.createElement('span', { className: 'kanban__column-count', key: 'count' }, jobs.length)
        ]
      ),

      // Cards List
      React.createElement(
        'div',
        { className: 'kanban__card-list', key: 'cards' },
        jobs.map(job => 
          React.createElement(JobCard, {
            key: job.id,
            job: job,
            status: status,
            onClick: onJobClick
          })
        )
      )
    ]
  );
};
export default Column;
