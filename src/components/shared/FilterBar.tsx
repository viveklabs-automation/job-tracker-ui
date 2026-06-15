// filepath: src/components/shared/FilterBar.tsx

import React from 'react';
import { X } from 'lucide-react';
import type { FilterState } from '../../hooks/useFilters';
import type { Priority, EmploymentType } from '../../types';
import './shared.css';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: React.Dispatch<React.SetStateAction<FilterState>>;
  onClear: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  onFilterChange, 
  onClear 
}) => {
  const priorities: Priority[] = ['High', 'Medium', 'Low'];
  const employmentTypes: EmploymentType[] = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onFilterChange(prev => ({
      ...prev,
      priorities: val ? [val as Priority] : []
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onFilterChange(prev => ({
      ...prev,
      employmentTypes: val ? [val as EmploymentType] : []
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onFilterChange(prev => ({
      ...prev,
      location: val
    }));
  };

  const hasActiveFilters = 
    filters.priorities.length > 0 || 
    filters.employmentTypes.length > 0 || 
    filters.location.trim() !== '' || 
    filters.dateRange.start !== null || 
    filters.dateRange.end !== null;

  return React.createElement(
    'div',
    { className: 'filter-bar' },
    [
      // Priority Filter
      React.createElement(
        'div',
        { className: 'filter-bar__select-wrapper', key: 'priority' },
        React.createElement(
          'select',
          {
            className: 'filter-bar__select',
            value: filters.priorities[0] || '',
            onChange: handlePriorityChange,
            'aria-label': 'Filter by Priority'
          },
          [
            React.createElement('option', { value: '', key: 'all' }, 'All Priorities'),
            ...priorities.map(p => React.createElement('option', { value: p, key: p }, p))
          ]
        )
      ),

      // Employment Type Filter
      React.createElement(
        'div',
        { className: 'filter-bar__select-wrapper', key: 'type' },
        React.createElement(
          'select',
          {
            className: 'filter-bar__select',
            value: filters.employmentTypes[0] || '',
            onChange: handleTypeChange,
            'aria-label': 'Filter by Employment Type'
          },
          [
            React.createElement('option', { value: '', key: 'all' }, 'All Employment Types'),
            ...employmentTypes.map(t => React.createElement('option', { value: t, key: t }, t))
          ]
        )
      ),

      // Location Filter
      React.createElement(
        'div',
        { style: { position: 'relative' }, key: 'location' },
        React.createElement(
          'input',
          {
            type: 'text',
            className: 'filter-bar__select', // Reuses border styles
            style: { paddingRight: '24px', width: '160px' },
            placeholder: 'Filter by location...',
            value: filters.location,
            onChange: handleLocationChange,
            'aria-label': 'Filter by Location'
          }
        )
      ),

      // Clear Filters Button
      hasActiveFilters && React.createElement(
        'button',
        {
          key: 'clear',
          className: 'filter-bar__clear-btn',
          onClick: onClear,
          'aria-label': 'Clear all filters'
        },
        [
          React.createElement(X, { size: 14, key: 'icon' }),
          'Clear Filters'
        ]
      )
    ]
  );
};
