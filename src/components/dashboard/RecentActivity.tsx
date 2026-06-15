// filepath: src/components/dashboard/RecentActivity.tsx

import React from 'react';
import { useJobs } from '../../hooks/useJobs';
import { Briefcase, Activity } from 'lucide-react';
import './dashboard.css';

interface ActivityItem {
  id: string; // unique key (jobId + timestamp)
  jobId: string;
  companyName: string;
  jobTitle: string;
  statusId: string;
  changedAt: number;
}

export const RecentActivity: React.FC = () => {
  const { jobs, statuses } = useJobs();

  // Extract all status history items across all jobs
  const activities: ActivityItem[] = [];
  jobs.forEach(job => {
    if (job.statusHistory && job.statusHistory.length > 0) {
      job.statusHistory.forEach((hist, idx) => {
        activities.push({
          id: `${job.id}-${hist.changedAt}-${idx}`,
          jobId: job.id,
          companyName: job.companyName,
          jobTitle: job.jobTitle,
          statusId: hist.statusId,
          changedAt: hist.changedAt
        });
      });
    }
  });

  // Sort descending
  const sortedActivities = activities
    .sort((a, b) => b.changedAt - a.changedAt)
    .slice(0, 10); // show top 10 recent items

  const getRelativeTime = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return days === 1 ? 'Yesterday' : `${days} days ago`;
    }
    if (hours > 0) {
      return `${hours}h ago`;
    }
    if (mins > 0) {
      return `${mins}m ago`;
    }
    return 'Just now';
  };

  const getStatusLabel = (statusId: string): { label: string; color: string } => {
    const s = statuses.find(st => st.id === statusId);
    return {
      label: s ? s.label : 'Unknown',
      color: s ? s.color : '#6b7280'
    };
  };

  return React.createElement(
    'div',
    { className: 'dashboard__panel' },
    [
      // Title
      React.createElement(
        'h3',
        { className: 'dashboard__panel-title', key: 'title' },
        [
          React.createElement(Activity, { size: 18, style: { color: 'var(--brand-primary)' }, key: 'icon' }),
          'Recent Activity'
        ]
      ),

      // List Body
      React.createElement(
        'div',
        { className: 'dashboard__panel-body', key: 'body' },
        sortedActivities.length === 0
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
              'No recent activity. Update your job application status to see activity logs.'
            )
          : sortedActivities.map(activity => {
              const status = getStatusLabel(activity.statusId);
              return React.createElement(
                'div',
                { className: 'activity-item', key: activity.id },
                [
                  React.createElement(
                    'div',
                    { className: 'activity-item__dot', key: 'dot' },
                    React.createElement(Briefcase, { size: 12, style: { color: 'var(--brand-primary)' } })
                  ),
                  React.createElement(
                    'div',
                    { className: 'activity-item__content', key: 'content' },
                    [
                      React.createElement(
                        'div',
                        { className: 'activity-item__text', key: 'text' },
                        [
                          React.createElement('strong', { key: 'comp' }, activity.companyName),
                          ' — ',
                          activity.jobTitle
                        ]
                      ),
                      React.createElement(
                        'div',
                        { className: 'activity-item__detail', key: 'detail' },
                        [
                          'Status updated to: ',
                          React.createElement(
                            'span',
                            { 
                              style: { 
                                color: status.color, 
                                fontWeight: 600, 
                                borderBottom: `1.5px solid ${status.color}`,
                                paddingBottom: '1px' 
                              } 
                            },
                            status.label
                          )
                        ]
                      ),
                      React.createElement(
                        'div',
                        { className: 'activity-item__time', key: 'time' },
                        getRelativeTime(activity.changedAt)
                      )
                    ]
                  )
                ]
              );
            })
      )
    ]
  );
};
