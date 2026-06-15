// filepath: src/components/analytics/Charts.tsx

import React from 'react';
import { useJobs } from '../../hooks/useJobs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import './analytics.css';

export const Charts: React.FC = () => {
  const { jobs, statuses } = useJobs();

  const totalJobs = jobs.length;

  // 1. Calculate status distribution
  const statusData = statuses.map(status => {
    const count = jobs.filter(j => !j.isArchived && j.statusId === status.id).length;
    return {
      name: status.label,
      count,
      color: status.color
    };
  }).filter(d => d.count > 0); // show only active statuses with jobs

  // 2. Funnel metrics
  // Applied: status order >= 3
  const totalApplied = jobs.filter(j => {
    const s = statuses.find(st => st.id === j.statusId);
    return s && s.order >= 3;
  }).length;

  // Screened: status order >= 4
  const totalScreened = jobs.filter(j => {
    const s = statuses.find(st => st.id === j.statusId);
    return s && s.order >= 4;
  }).length;

  // Interviewed: status order >= 6
  const totalInterviewed = jobs.filter(j => {
    const s = statuses.find(st => st.id === j.statusId);
    return s && s.order >= 6;
  }).length;

  // Offers: status order >= 10
  const totalOffers = jobs.filter(j => {
    const s = statuses.find(st => st.id === j.statusId);
    return s && s.order >= 10;
  }).length;

  const funnelData = [
    { stage: 'Applied', count: totalApplied },
    { stage: 'Screening', count: totalScreened },
    { stage: 'Interviewing', count: totalInterviewed },
    { stage: 'Offers', count: totalOffers }
  ];

  // 3. Priority distribution
  const highCount = jobs.filter(j => !j.isArchived && j.priority === 'High').length;
  const mediumCount = jobs.filter(j => !j.isArchived && j.priority === 'Medium').length;
  const lowCount = jobs.filter(j => !j.isArchived && j.priority === 'Low').length;

  const priorityData = [
    { name: '🔥 High', value: highCount, color: 'var(--color-priority-high)' },
    { name: '⚡ Medium', value: mediumCount, color: 'var(--color-priority-medium)' },
    { name: '💤 Low', value: lowCount, color: 'var(--color-priority-low)' }
  ].filter(d => d.value > 0);

  // 4. Summaries
  const interviewRate = totalApplied > 0 ? Math.round((totalInterviewed / totalApplied) * 100) : 0;
  const offerRate = totalApplied > 0 ? Math.round((totalOffers / totalApplied) * 100) : 0;

  // Custom tooltips to support responsive themes
  const customTooltipStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)'
  };

  return React.createElement(
    'div',
    { className: 'analytics animate-fade-in' },
    [
      // Header
      React.createElement(
        'div',
        { className: 'analytics__header', key: 'header' },
        React.createElement('h2', { style: { fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' } }, 'Analytics Dashboard')
      ),

      // Summary widgets
      React.createElement(
        'div',
        { className: 'analytics__summary', key: 'summary' },
        [
          React.createElement(
            'div',
            { className: 'analytics__summary-item', key: 'total' },
            [
              React.createElement('div', { className: 'analytics__summary-val' }, totalJobs),
              React.createElement('div', { className: 'analytics__summary-lbl' }, 'Total Tracked')
            ]
          ),
          React.createElement(
            'div',
            { className: 'analytics__summary-item', key: 'int-rate' },
            [
              React.createElement('div', { className: 'analytics__summary-val' }, `${interviewRate}%`),
              React.createElement('div', { className: 'analytics__summary-lbl' }, 'Interview Rate')
            ]
          ),
          React.createElement(
            'div',
            { className: 'analytics__summary-item', key: 'off-rate' },
            [
              React.createElement('div', { className: 'analytics__summary-val' }, `${offerRate}%`),
              React.createElement('div', { className: 'analytics__summary-lbl' }, 'Offer Conversion')
            ]
          )
        ]
      ),

      // Charts Grid
      React.createElement(
        'div',
        { className: 'analytics__grid', key: 'grid' },
        [
          // Funnel Chart
          React.createElement(
            'div',
            { className: 'analytics__card', key: 'funnel' },
            [
              React.createElement(
                'h3',
                { className: 'analytics__card-title' },
                [
                  React.createElement(TrendingUp, { size: 16, style: { marginRight: '8px', verticalAlign: 'middle', color: 'var(--brand-primary)' } }),
                  'Application Funnel Conversion'
                ]
              ),
              React.createElement(
                'div',
                { className: 'analytics__chart-container' },
                totalApplied === 0
                  ? 'No applications in pipeline. Apply to see funnel conversions.'
                  : React.createElement(
                      ResponsiveContainer as any,
                      { width: '100%', height: '100%' },
                      React.createElement(
                        BarChart as any,
                        { data: funnelData, layout: 'vertical', margin: { left: 10, right: 30, top: 10, bottom: 10 } },
                        [
                          React.createElement(CartesianGrid as any, { strokeDasharray: '3 3', stroke: 'var(--border-color)', horizontal: false }),
                          React.createElement(XAxis as any, { type: 'number', stroke: 'var(--text-secondary)' }),
                          React.createElement(YAxis as any, { dataKey: 'stage', type: 'category', stroke: 'var(--text-secondary)' }),
                          React.createElement(Tooltip as any, { contentStyle: customTooltipStyle }),
                          React.createElement(Bar as any, { dataKey: 'count', fill: 'var(--brand-primary)', radius: [0, 4, 4, 0] })
                        ]
                      )
                    )
              )
            ]
          ),

          // Status Chart
          React.createElement(
            'div',
            { className: 'analytics__card', key: 'status' },
            [
              React.createElement(
                'h3',
                { className: 'analytics__card-title' },
                [
                  React.createElement(BarChart3, { size: 16, style: { marginRight: '8px', verticalAlign: 'middle', color: 'var(--brand-primary)' } }),
                  'Active Stage distribution'
                ]
              ),
              React.createElement(
                'div',
                { className: 'analytics__chart-container' },
                statusData.length === 0
                  ? 'No active listings in board columns.'
                  : React.createElement(
                      ResponsiveContainer as any,
                      { width: '100%', height: '100%' },
                      React.createElement(
                        BarChart as any,
                        { data: statusData, margin: { top: 10, right: 10, left: 0, bottom: 20 } },
                        [
                          React.createElement(CartesianGrid as any, { strokeDasharray: '3 3', stroke: 'var(--border-color)', vertical: false }),
                          React.createElement(XAxis as any, { dataKey: 'name', stroke: 'var(--text-secondary)', tick: { fontSize: 10, angle: -15, textAnchor: 'end' } }),
                          React.createElement(YAxis as any, { stroke: 'var(--text-secondary)', allowDecimals: false }),
                          React.createElement(Tooltip as any, { contentStyle: customTooltipStyle }),
                          React.createElement(
                            Bar as any,
                            { dataKey: 'count', radius: [4, 4, 0, 0] },
                            statusData.map((entry, index) => 
                              React.createElement(Cell as any, { key: `cell-${index}`, fill: entry.color })
                            )
                          )
                        ]
                      )
                    )
              )
            ]
          ),

          // Priority Chart
          React.createElement(
            'div',
            { className: 'analytics__card', key: 'priority' },
            [
              React.createElement(
                'h3',
                { className: 'analytics__card-title' },
                [
                  React.createElement(PieIcon, { size: 16, style: { marginRight: '8px', verticalAlign: 'middle', color: 'var(--brand-primary)' } }),
                  'Priority Breakdown'
                ]
              ),
              React.createElement(
                'div',
                { className: 'analytics__chart-container' },
                priorityData.length === 0
                  ? 'No applications with priority levels.'
                  : React.createElement(
                      ResponsiveContainer as any,
                      { width: '100%', height: '100%' },
                      React.createElement(
                        PieChart as any,
                        null,
                        [
                          React.createElement(
                            Pie as any,
                            {
                              data: priorityData,
                              cx: '50%',
                              cy: '45%',
                              innerRadius: 60,
                              outerRadius: 80,
                              paddingAngle: 5,
                              dataKey: 'value'
                            },
                            priorityData.map((entry, index) => 
                              React.createElement(Cell as any, { key: `cell-${index}`, fill: entry.color })
                            )
                          ),
                          React.createElement(Tooltip as any, { contentStyle: customTooltipStyle }),
                          React.createElement(Legend as any, { verticalAlign: 'bottom', height: 36 })
                        ]
                      )
                    )
              )
            ]
          )
        ]
      )
    ]
  );
};
export default Charts;
