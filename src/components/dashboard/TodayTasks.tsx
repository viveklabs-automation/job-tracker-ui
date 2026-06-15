// filepath: src/components/dashboard/TodayTasks.tsx

import React, { useState } from 'react';
import { useJobs } from '../../hooks/useJobs';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';
import './dashboard.css';

export const TodayTasks: React.FC = () => {
  const { tasks, jobs, addTask, toggleTask, deleteTask } = useJobs();
  const [newTitle, setNewTitle] = useState('');
  const [jobId, setJobId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await addTask({
      title: newTitle.trim(),
      jobId: jobId || undefined,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined
    });

    setNewTitle('');
    setJobId('');
    setDueDate('');
  };

  // Sort tasks: pending first, then by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isDone !== b.isDone) {
      return a.isDone ? 1 : -1;
    }
    if (a.dueDate && b.dueDate) {
      return a.dueDate - b.dueDate;
    }
    return b.createdAt - a.createdAt;
  });

  const activeJobs = jobs.filter(j => !j.isArchived);

  return React.createElement(
    'div',
    { className: 'dashboard__panel' },
    [
      // Header
      React.createElement(
        'h3',
        { className: 'dashboard__panel-title', key: 'title' },
        [
          React.createElement(CheckSquare, { size: 18, style: { color: 'var(--brand-primary)' }, key: 'icon' }),
          'Tasks Checklist'
        ]
      ),

      // Task List
      React.createElement(
        'div',
        { className: 'dashboard__panel-body', key: 'body' },
        sortedTasks.length === 0
          ? React.createElement(
              'div',
              { 
                style: { 
                  padding: 'var(--space-6)', 
                  textAlign: 'center', 
                  color: 'var(--text-tertiary)', 
                  fontSize: '0.875rem' 
                } 
              },
              'No tasks created yet. Use the form below to add one.'
            )
          : sortedTasks.map(task => {
              const associatedJob = jobs.find(j => j.id === task.jobId);
              const isOverdue = task.dueDate && task.dueDate < Date.now() && !task.isDone;
              
              return React.createElement(
                'div',
                { className: 'task-item', key: task.id },
                [
                  React.createElement(
                    'button',
                    {
                      className: `task-item__checkbox ${task.isDone ? 'task-item__checkbox--done' : ''}`,
                      onClick: () => toggleTask(task.id),
                      'aria-label': task.isDone ? 'Mark task as incomplete' : 'Mark task as complete',
                      key: 'checkbox'
                    },
                    task.isDone && React.createElement('span', { style: { fontSize: '10px' } }, '✓')
                  ),
                  React.createElement(
                    'div',
                    { 
                      className: `task-item__label ${task.isDone ? 'task-item__label--done' : ''}`,
                      key: 'label'
                    },
                    [
                      React.createElement('div', { key: 'task-title' }, task.title),
                      associatedJob && React.createElement(
                        'div',
                        { 
                          style: { 
                            fontSize: '0.75rem', 
                            color: 'var(--text-secondary)', 
                            fontWeight: 500 
                          }, 
                          key: 'job-ref' 
                        },
                        `${associatedJob.jobTitle} @ ${associatedJob.companyName}`
                      )
                    ]
                  ),
                  React.createElement(
                    'div',
                    { style: { display: 'flex', alignItems: 'center', gap: '8px' }, key: 'actions' },
                    [
                      task.dueDate && React.createElement(
                        'span',
                        { 
                          className: `task-item__due ${isOverdue ? 'task-item__due--overdue' : ''}`,
                          key: 'due'
                        },
                        new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                      ),
                      React.createElement(
                        'button',
                        {
                          style: { color: 'var(--text-tertiary)', cursor: 'pointer' },
                          onClick: () => deleteTask(task.id),
                          'aria-label': 'Delete task',
                          title: 'Delete Task',
                          key: 'delete'
                        },
                        React.createElement(Trash2, { size: 14 })
                      )
                    ]
                  )
                ]
              );
            })
      ),

      // Add Task Form
      React.createElement(
        'form',
        { 
          onSubmit: handleAddTask, 
          style: { 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            borderTop: '1px solid var(--border-color)', 
            paddingTop: '12px' 
          },
          key: 'form'
        },
        [
          React.createElement(
            'input',
            {
              type: 'text',
              className: 'form-input',
              style: { padding: '8px 12px', fontSize: '0.875rem' },
              placeholder: 'Add new task...',
              value: newTitle,
              onChange: (e) => setNewTitle(e.target.value),
              required: true
            }
          ),
          React.createElement(
            'div',
            { style: { display: 'grid', gridTemplateColumns: '1.2fr 1fr auto', gap: '8px' } },
            [
              React.createElement(
                'select',
                {
                  className: 'form-select',
                  style: { padding: '6px 8px', fontSize: '0.825rem' },
                  value: jobId,
                  onChange: (e) => setJobId(e.target.value),
                  'aria-label': 'Link task to job'
                },
                [
                  React.createElement('option', { value: '', key: 'none' }, 'No Job Link'),
                  ...activeJobs.map(j => React.createElement('option', { value: j.id, key: j.id }, `${j.jobTitle} - ${j.companyName}`))
                ]
              ),
              React.createElement(
                'input',
                {
                  type: 'date',
                  className: 'form-input',
                  style: { padding: '6px 8px', fontSize: '0.825rem' },
                  value: dueDate,
                  onChange: (e) => setDueDate(e.target.value),
                  'aria-label': 'Task due date'
                }
              ),
              React.createElement(
                'button',
                {
                  type: 'submit',
                  className: 'btn btn-primary',
                  style: { padding: '6px 12px', fontSize: '0.825rem', display: 'flex', gap: '4px' }
                },
                [
                  React.createElement(Plus, { size: 14 }),
                  'Add'
                ]
              )
            ]
          )
        ]
      )
    ]
  );
};
