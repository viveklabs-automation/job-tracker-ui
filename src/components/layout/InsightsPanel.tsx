// filepath: src/components/layout/InsightsPanel.tsx

import React from 'react';
import { useJobs } from '../../hooks/useJobs';
import { 
  CheckSquare, 
  Briefcase, 
  Clock, 
  Sparkles,
  Check,
  Trash2,
  ChevronRight
} from 'lucide-react';
import './layout.css';

interface InsightsPanelProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ isCollapsed, onToggleCollapse }) => {
  const { jobs, tasks, reminders, updateReminder, deleteReminder } = useJobs();

  // 1. Calculate stats
  const activeJobs = jobs.filter(j => !j.isArchived);
  const interviewJobs = jobs.filter(j => 
    !j.isArchived && 
    (j.statusId.includes('status-6') || j.statusId.includes('status-7') || j.statusId.includes('status-8') || j.statusId.includes('status-9'))
  );
  
  const pendingTasks = tasks.filter(t => !t.isDone);
  
  // Upcoming reminders (not read, and if snoozed, the snooze time has elapsed)
  const activeReminders = reminders
    .filter(r => !r.isRead && (!r.isSnoozed || (r.snoozeUntil && r.snoozeUntil < Date.now())))
    .sort((a, b) => a.scheduledAt - b.scheduledAt);

  const handleMarkRead = async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      await updateReminder({ ...reminder, isRead: true });
    }
  };

  const handleSnooze = async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      await updateReminder({ 
        ...reminder, 
        isSnoozed: true, 
        snoozeUntil: Date.now() + 10 * 60 * 1000 // Snooze for 10 minutes
      });
    }
  };

  const handleDelete = async (id: string) => {
    await deleteReminder(id);
  };

  return React.createElement(
    'aside',
    { className: `insights-panel ${isCollapsed ? 'insights-panel--collapsed' : ''}` },
    [
      React.createElement(
        'div',
        { className: 'insights-panel__section', style: { borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }, key: 'header' },
        [
          React.createElement(
            'div',
            { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }, key: 'title-container' },
            [
              React.createElement(
                'div',
                { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                [
                  React.createElement(Sparkles, { className: 'sidebar__nav-icon', style: { color: 'var(--brand-primary)' } }),
                  React.createElement('h2', { className: 'insights-panel__title' }, 'Insights & Reminders')
                ]
              ),
              React.createElement(
                'button',
                {
                  className: 'sidebar__collapse-btn',
                  onClick: onToggleCollapse,
                  'aria-label': 'Collapse insights panel',
                  title: 'Collapse Insights',
                  key: 'collapse-chevron'
                },
                React.createElement(ChevronRight, { size: 16 })
              )
            ]
          )
        ]
      ),

      // Stats Section
      React.createElement(
        'div',
        { className: 'insights-panel__section', key: 'stats' },
        [
          React.createElement('h3', { className: 'insights-panel__section-title' }, 'Quick Stats'),
          React.createElement(
            'div',
            { className: 'insights-panel__stat-card' },
            [
              React.createElement('div', { className: 'insights-panel__stat-icon' }, React.createElement(Briefcase, { size: 18 })),
              React.createElement(
                'div',
                { className: 'insights-panel__stat-content' },
                [
                  React.createElement('span', { className: 'insights-panel__stat-value' }, activeJobs.length),
                  React.createElement('span', { className: 'insights-panel__stat-label' }, 'Active Applications')
                ]
              )
            ]
          ),
          React.createElement(
            'div',
            { className: 'insights-panel__stat-card' },
            [
              React.createElement('div', { className: 'insights-panel__stat-icon', style: { color: 'var(--color-priority-high)' } }, React.createElement(Clock, { size: 18 })),
              React.createElement(
                'div',
                { className: 'insights-panel__stat-content' },
                [
                  React.createElement('span', { className: 'insights-panel__stat-value' }, interviewJobs.length),
                  React.createElement('span', { className: 'insights-panel__stat-label' }, 'Interviewing Stages')
                ]
              )
            ]
          ),
          React.createElement(
            'div',
            { className: 'insights-panel__stat-card' },
            [
              React.createElement('div', { className: 'insights-panel__stat-icon', style: { color: 'var(--color-priority-medium)' } }, React.createElement(CheckSquare, { size: 18 })),
              React.createElement(
                'div',
                { className: 'insights-panel__stat-content' },
                [
                  React.createElement('span', { className: 'insights-panel__stat-value' }, pendingTasks.length),
                  React.createElement('span', { className: 'insights-panel__stat-label' }, 'Pending Tasks')
                ]
              )
            ]
          )
        ]
      ),

      // Reminders Section
      React.createElement(
        'div',
        { className: 'insights-panel__section', style: { flex: 1 }, key: 'reminders' },
        [
          React.createElement(
            'div',
            { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            [
              React.createElement('h3', { className: 'insights-panel__section-title' }, 'Alerts & Actions'),
              activeReminders.length > 0 && React.createElement(
                'span',
                { 
                  style: { 
                    backgroundColor: 'var(--brand-primary)', 
                    color: 'white', 
                    borderRadius: '12px', 
                    padding: '2px 8px', 
                    fontSize: '10px', 
                    fontWeight: 700 
                  } 
                },
                activeReminders.length
              )
            ]
          ),
          activeReminders.length === 0
            ? React.createElement(
                'div',
                { 
                  style: { 
                    padding: 'var(--space-6)', 
                    textAlign: 'center', 
                    color: 'var(--text-tertiary)', 
                    fontSize: '0.875rem', 
                    border: '1px dashed var(--border-color)', 
                    borderRadius: 'var(--radius-md)' 
                  } 
                },
                'All caught up! No active reminders.'
              )
            : React.createElement(
                'div',
                { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
                activeReminders.map(reminder => {
                  const job = jobs.find(j => j.id === reminder.jobId);
                  return React.createElement(
                    'div',
                    { className: 'insights-panel__reminder-card', key: reminder.id },
                    [
                      React.createElement(
                        'div',
                        { className: 'insights-panel__reminder-header' },
                        [
                          React.createElement('span', { className: 'insights-panel__reminder-title' }, reminder.title),
                          React.createElement(
                            'span',
                            { className: 'insights-panel__reminder-time' },
                            new Date(reminder.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          )
                        ]
                      ),
                      job && React.createElement(
                        'span',
                        { style: { fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 } },
                        `${job.jobTitle} @ ${job.companyName}`
                      ),
                      React.createElement(
                        'div',
                        { className: 'insights-panel__reminder-actions' },
                        [
                          React.createElement(
                            'button',
                            {
                              className: 'insights-panel__action-btn',
                              onClick: () => handleMarkRead(reminder.id),
                              'aria-label': 'Mark reminder as read',
                              title: 'Mark Read'
                            },
                            React.createElement(Check, { size: 12 })
                          ),
                          React.createElement(
                            'button',
                            {
                              className: 'insights-panel__action-btn',
                              onClick: () => handleSnooze(reminder.id),
                              'aria-label': 'Snooze reminder for 10 minutes',
                              title: 'Snooze 10m'
                            },
                            React.createElement(Clock, { size: 12 })
                          ),
                          React.createElement(
                            'button',
                            {
                              className: 'insights-panel__action-btn',
                              onClick: () => handleDelete(reminder.id),
                              'aria-label': 'Delete reminder',
                              title: 'Delete'
                            },
                            React.createElement(Trash2, { size: 12 })
                          )
                        ]
                      )
                    ]
                  );
                })
              )
        ]
      )
    ]
  );
};
