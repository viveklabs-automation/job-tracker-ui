// filepath: src/components/kanban/JobCard.tsx

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Job, Status } from '../../types';
import { Calendar, AlertTriangle } from 'lucide-react';
import './kanban.css';

interface JobCardProps {
  job: Job;
  status: Status;
  onClick: (jobId: string) => void;
  isOverlay?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, status, onClick, isOverlay = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: job.id,
    disabled: isOverlay
  });

  const style: React.CSSProperties = {
    transform: (isOverlay || isDragging) ? undefined : CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : undefined,
    borderColor: isDragging ? 'var(--brand-primary)' : undefined,
    borderStyle: isDragging ? 'dashed' : undefined,
    '--status-color': status.color,
    boxShadow: isOverlay ? 'var(--shadow-lg)' : undefined,
    cursor: isOverlay ? 'grabbing' : 'grab'
  } as React.CSSProperties;

  const getRelativeDate = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Added Today';
    if (days === 1) return 'Added Yesterday';
    return `${days}d ago`;
  };

  const getPriorityClass = (priority: string) => {
    if (priority === 'High') return 'job-card__badge--high';
    if (priority === 'Medium') return 'job-card__badge--medium';
    return 'job-card__badge--low';
  };

  return React.createElement(
    'div',
    {
      ref: setNodeRef,
      style: style,
      className: `job-card ${isDragging ? 'job-card--dragging' : ''} ${isOverlay ? 'job-card--overlay' : ''}`,
      ...attributes,
      ...listeners
    },
    [
      // Card Header
      React.createElement(
        'div',
        { className: 'job-card__header', key: 'header' },
        [
          React.createElement('span', { className: 'job-card__company', key: 'company' }, job.companyName),
          job.isDuplicate && React.createElement(
            'span',
            { 
              className: 'job-card__duplicate-tag', 
              title: 'An active application already exists for this job title at this company.',
              key: 'duplicate'
            },
            React.createElement(AlertTriangle, { size: 10, style: { marginRight: '2px' } })
          )
        ]
      ),

      // Card Title (clickable, opens drawer)
      React.createElement(
        'h4',
        { 
          className: 'job-card__title', 
          onClick: (e) => {
            e.stopPropagation(); // prevent drag triggers
            onClick(job.id);
          },
          onPointerDown: (e) => {
            // Stop drag-and-drop listener from intercepting clicks on the title
            e.stopPropagation();
          },
          key: 'title'
        },
        job.jobTitle
      ),

      // Meta Badges
      React.createElement(
        'div',
        { className: 'job-card__meta', key: 'meta' },
        [
          React.createElement(
            'span',
            { className: `job-card__badge ${getPriorityClass(job.priority)}`, key: 'priority' },
            `${job.priority} Priority`
          ),
          job.employmentType && React.createElement(
            'span',
            { className: 'job-card__badge', key: 'type' },
            job.employmentType
          )
        ]
      ),

      // Card Footer
      React.createElement(
        'div',
        { className: 'job-card__footer', key: 'footer' },
        [
          React.createElement(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '4px' }, key: 'date-container' },
            [
              React.createElement(Calendar, { size: 12 }),
              React.createElement('span', null, getRelativeDate(job.dateAdded))
            ]
          ),
          job.salaryRange && React.createElement(
            'span',
            { style: { fontWeight: 500, color: 'var(--text-secondary)' }, key: 'salary' },
            job.salaryRange
          )
        ]
      )
    ]
  );
};
