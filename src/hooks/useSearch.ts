// filepath: src/hooks/useSearch.ts

import { useState, useEffect } from 'react';
import type { Job } from '../types';

export function useSearch(jobs: Job[], searchTerm: string): Job[] {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchTerm.trim()) {
        setFilteredJobs(jobs);
        return;
      }
      
      const query = searchTerm.toLowerCase().trim();
      const filtered = jobs.filter(job => 
        job.jobTitle.toLowerCase().includes(query) ||
        job.companyName.toLowerCase().includes(query) ||
        (job.location && job.location.toLowerCase().includes(query)) ||
        (job.notes && job.notes.toLowerCase().includes(query))
      );
      setFilteredJobs(filtered);
    }, 200); // Debounce delay 200ms (satisfies ≤ 300ms spec)

    return () => {
      clearTimeout(handler);
    };
  }, [jobs, searchTerm]);

  return filteredJobs;
}
