// filepath: src/hooks/useFilters.ts

import { useState, useMemo } from 'react';
import type { Job, Priority, EmploymentType } from '../types';

export interface FilterState {
  priorities: Priority[];
  employmentTypes: EmploymentType[];
  location: string;
  dateRange: { start: number | null; end: number | null };
  statusIds: string[];
}

export function useFilters(jobs: Job[]) {
  const [filters, setFilters] = useState<FilterState>({
    priorities: [],
    employmentTypes: [],
    location: '',
    dateRange: { start: null, end: null },
    statusIds: []
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // 1. Priority
      if (filters.priorities.length > 0 && !filters.priorities.includes(job.priority)) {
        return false;
      }
      // 2. Employment Type
      if (filters.employmentTypes.length > 0) {
        if (!job.employmentType || !filters.employmentTypes.includes(job.employmentType)) {
          return false;
        }
      }
      // 3. Location
      if (filters.location.trim()) {
        const locQuery = filters.location.toLowerCase().trim();
        if (!job.location || !job.location.toLowerCase().includes(locQuery)) {
          return false;
        }
      }
      // 4. Status
      if (filters.statusIds.length > 0 && !filters.statusIds.includes(job.statusId)) {
        return false;
      }
      // 5. Date Range (Date Added timestamp)
      if (filters.dateRange.start && job.dateAdded < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end) {
        // Set end to end of day if needed, but simple compare works
        if (job.dateAdded > filters.dateRange.end) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, filters]);

  const clearFilters = () => {
    setFilters({
      priorities: [],
      employmentTypes: [],
      location: '',
      dateRange: { start: null, end: null },
      statusIds: []
    });
  };

  return {
    filters,
    setFilters,
    filteredJobs,
    clearFilters
  };
}
