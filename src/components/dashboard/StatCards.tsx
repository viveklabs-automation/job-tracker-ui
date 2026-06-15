// filepath: src/components/dashboard/StatCards.tsx

import React from 'react';
import { useJobs } from '../../hooks/useJobs';
import { Briefcase, CalendarCheck, CheckCircle2, TrendingUp } from 'lucide-react';
import './dashboard.css';

export const StatCards: React.FC = () => {
  const { jobs } = useJobs();

  // Calculations
  const totalApplications = jobs.length;
  
  const activeApplications = jobs.filter(j => 
    !j.isArchived && 
    j.statusId !== 'status-12' && // Rejected
    j.statusId !== 'status-13'    // Withdrawn
  ).length;

  const interviewApplications = jobs.filter(j => 
    !j.isArchived && 
    ['status-6', 'status-7', 'status-8', 'status-9'].includes(j.statusId)
  ).length;

  const offersReceived = jobs.filter(j => 
    ['status-10', 'status-11'].includes(j.statusId)
  ).length;

  const cards = [
    {
      label: 'Total Applications',
      value: totalApplications,
      icon: Briefcase,
      color: 'rgba(99, 102, 241, 0.15)',
      textColor: 'var(--brand-primary)'
    },
    {
      label: 'Active Pursuit',
      value: activeApplications,
      icon: TrendingUp,
      color: 'rgba(6, 182, 212, 0.15)',
      textColor: 'var(--brand-secondary)'
    },
    {
      label: 'Interviews Scheduled',
      value: interviewApplications,
      icon: CalendarCheck,
      color: 'rgba(245, 158, 11, 0.15)',
      textColor: 'var(--color-priority-medium)'
    },
    {
      label: 'Offers Secured',
      value: offersReceived,
      icon: CheckCircle2,
      color: 'rgba(16, 185, 129, 0.15)',
      textColor: '#10b981'
    }
  ];

  return React.createElement(
    'div',
    { className: 'dashboard__grid' },
    cards.map((card, idx) => 
      React.createElement(
        'div',
        { className: 'dashboard__card', key: idx },
        [
          React.createElement(
            'div',
            { 
              className: 'dashboard__card-icon', 
              style: { backgroundColor: card.color, color: card.textColor },
              key: 'icon'
            },
            React.createElement(card.icon, { size: 24 })
          ),
          React.createElement(
            'div',
            { className: 'dashboard__card-info', key: 'info' },
            [
              React.createElement('span', { className: 'dashboard__card-value', key: 'val' }, card.value),
              React.createElement('span', { className: 'dashboard__card-label', key: 'label' }, card.label)
            ]
          )
        ]
      )
    )
  );
};
