// filepath: src/components/jobDetail/Timeline.tsx

import React from 'react';
import type { StatusHistoryEntry, Status } from '../../types';
import './jobDetail.css';

interface TimelineProps {
  history: StatusHistoryEntry[];
  statuses: Status[];
}

export const Timeline: React.FC<TimelineProps> = ({ history, statuses }) => {
  // Sort history: oldest first or newest first?
  // A history is usually best viewed chronologically (oldest to newest) or reverse. Let's show newest first so latest update is at the top.
  const sortedHistory = [...history].sort((a, b) => b.changedAt - a.changedAt);

  const getStatusDetails = (statusId: string): { label: string; color: string } => {
    const s = statuses.find(st => st.id === statusId);
    return {
      label: s ? s.label : 'Status Changed',
      color: s ? s.color : '#94a3b8'
    };
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return React.createElement(
    'div',
    { className: 'timeline' },
    sortedHistory.map((item, idx) => {
      const details = getStatusDetails(item.statusId);
      const customStyle = { '--timeline-color': details.color } as React.CSSProperties;

      return React.createElement(
        'div',
        { className: 'timeline-item', style: customStyle, key: idx },
        [
          React.createElement('div', { className: 'timeline-item__dot', key: 'dot' }),
          React.createElement(
            'div',
            { className: 'timeline-item__content', key: 'content' },
            [
              React.createElement('span', { className: 'timeline-item__status', key: 'status' }, details.label),
              React.createElement('span', { className: 'timeline-item__time', key: 'time' }, formatDateTime(item.changedAt)),
              item.note && React.createElement('p', { className: 'timeline-item__note', key: 'note' }, item.note)
            ]
          )
        ]
      );
    })
  );
};
export default Timeline;
