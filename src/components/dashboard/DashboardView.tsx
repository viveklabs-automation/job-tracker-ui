// filepath: src/components/dashboard/DashboardView.tsx

import React from 'react';
import { StatCards } from './StatCards';
import { TodayTasks } from './TodayTasks';
import { RecentActivity } from './RecentActivity';
import './dashboard.css';

export const DashboardView: React.FC = () => {
  // Simple dynamic greeting based on current local hours
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning ☀️';
    if (hours < 18) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  return React.createElement(
    'div',
    { className: 'dashboard animate-fade-in' },
    [
      // Dashboard Header
      React.createElement(
        'div',
        { className: 'dashboard__header', key: 'header' },
        React.createElement(
          'div',
          { key: 'title-container' },
          [
            React.createElement('h2', { style: { fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' } }, getGreeting()),
            React.createElement('p', { className: 'dashboard__title-desc' }, "Here is the status of your current job search and tasks.")
          ]
        )
      ),

      // Stat Cards Grid
      React.createElement(StatCards, { key: 'stats' }),

      // Split panels: Tasks & Recent Activity
      React.createElement(
        'div',
        { className: 'dashboard__split', key: 'panels' },
        [
          React.createElement(TodayTasks, { key: 'tasks' }),
          React.createElement(RecentActivity, { key: 'activity' })
        ]
      )
    ]
  );
};
export default DashboardView;
