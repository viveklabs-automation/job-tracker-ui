// filepath: src/components/calendar/CalendarView.tsx

import React, { useState } from 'react';
import { useJobs } from '../../hooks/useJobs';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import './calendar.css';

interface CalendarViewProps {
  onJobClick: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onJobClick }) => {
  const { jobs, tasks, reminders } = useJobs();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate calendar days
  const getDaysInMonth = () => {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    
    const days: Date[] = [];
    
    // Fill previous month padding days (getting start day of week, e.g. 0 for Sunday)
    const startDayOfWeek = start.getDay();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }
    
    // Fill current month days
    const totalDays = end.getDate();
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Fill next month padding days to make it a perfect grid of weeks (multiple of 7)
    const endDayOfWeek = end.getDay();
    const remainingDays = 6 - endDayOfWeek;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const calendarDays = getDaysInMonth();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Check if dates match (ignoring hours)
  const isSameDay = (date1: Date, timestamp2: number) => {
    const d1 = new Date(date1);
    const d2 = new Date(timestamp2);
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return React.createElement(
    'div',
    { className: 'calendar animate-fade-in' },
    [
      // Header controls
      React.createElement(
        'div',
        { className: 'calendar__header', key: 'header' },
        [
          React.createElement(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '8px' }, key: 'title-container' },
            [
              React.createElement(CalendarIcon, { className: 'sidebar__nav-icon', style: { color: 'var(--brand-primary)' } }),
              React.createElement('h2', { className: 'calendar__title', style: { textAlign: 'left', minWidth: 'auto' } }, 'Application Calendar')
            ]
          ),
          React.createElement(
            'div',
            { className: 'calendar__nav', key: 'nav' },
            [
              React.createElement(
                'button',
                { className: 'calendar__nav-btn', onClick: handlePrevMonth, 'aria-label': 'Previous month' },
                React.createElement(ChevronLeft, { size: 16 })
              ),
              React.createElement(
                'span',
                { className: 'calendar__title' },
                `${monthNames[month]} ${year}`
              ),
              React.createElement(
                'button',
                { className: 'calendar__nav-btn', onClick: handleNextMonth, 'aria-label': 'Next month' },
                React.createElement(ChevronRight, { size: 16 })
              )
            ]
          )
        ]
      ),

      // Month Grid
      React.createElement(
        'div',
        { className: 'calendar__grid', key: 'grid' },
        [
          // Weekdays
          ...weekdays.map(day => React.createElement('div', { className: 'calendar__weekday', key: day }, day)),

          // Days
          ...calendarDays.map((day, idx) => {
            const isCurrentMonth = day.getMonth() === month;
            
            // Filter events for this specific day
            const dayJobs = jobs.filter(j => !j.isArchived && isSameDay(day, j.dateAdded));
            const dayTasks = tasks.filter(t => t.dueDate && isSameDay(day, t.dueDate));
            const dayReminders = reminders.filter(r => !r.isRead && isSameDay(day, r.scheduledAt));

            const dayClasses = [
              'calendar__day',
              !isCurrentMonth ? 'calendar__day--outside' : '',
              isToday(day) ? 'calendar__day--today' : ''
            ].filter(Boolean).join(' ');

            return React.createElement(
              'div',
              { className: dayClasses, key: idx },
              [
                React.createElement('span', { className: 'calendar__day-number', key: 'num' }, day.getDate()),
                React.createElement(
                  'div',
                  { className: 'calendar__day-events', key: 'events' },
                  [
                    // Jobs events
                    ...dayJobs.map(job => 
                      React.createElement(
                        'div',
                        {
                          key: `job-${job.id}`,
                          className: 'calendar__event calendar__event--job',
                          onClick: () => onJobClick(job.id),
                          title: `Job Applied: ${job.jobTitle} @ ${job.companyName}`
                        },
                        `📝 ${job.companyName}`
                      )
                    ),

                    // Tasks events
                    ...dayTasks.map(task => 
                      React.createElement(
                        'div',
                        {
                          key: `task-${task.id}`,
                          className: `calendar__event calendar__event--task ${task.isDone ? 'calendar__event--task-done' : ''}`,
                          onClick: () => task.jobId && onJobClick(task.jobId),
                          title: `Task: ${task.title}`
                        },
                        `✓ ${task.title}`
                      )
                    ),

                    // Reminders events
                    ...dayReminders.map(rem => 
                      React.createElement(
                        'div',
                        {
                          key: `rem-${rem.id}`,
                          className: 'calendar__event calendar__event--reminder',
                          onClick: () => rem.jobId && onJobClick(rem.jobId),
                          title: `Reminder: ${rem.title}`
                        },
                        `⏰ ${rem.title}`
                      )
                    )
                  ]
                )
              ]
            );
          })
        ]
      )
    ]
  );
};
export default CalendarView;
