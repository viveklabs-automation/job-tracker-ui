// filepath: src/hooks/useJobs.ts

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Job, Status, Contact, Task, Reminder } from '../types';
import * as jobsDb from '../db/jobs';
import * as statusesDb from '../db/statuses';
import * as contactsDb from '../db/contacts';
import * as tasksDb from '../db/tasks';
import * as remindersDb from '../db/reminders';

interface JobsContextType {
  jobs: Job[];
  statuses: Status[];
  contacts: Contact[];
  tasks: Task[];
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  
  refreshAll: () => Promise<void>;
  
  // Job Actions
  addJob: (job: Omit<Job, 'id' | 'dateAdded' | 'isDuplicate' | 'statusHistory' | 'isArchived'>) => Promise<string>;
  updateJob: (job: Job) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  archiveJob: (id: string) => Promise<void>;
  
  // Status Actions
  addStatus: (status: Omit<Status, 'id'>) => Promise<string>;
  updateStatus: (status: Status) => Promise<void>;
  deleteStatus: (id: string) => Promise<void>;
  
  // Contact Actions
  addContact: (contact: Omit<Contact, 'id'>) => Promise<string>;
  updateContact: (contact: Contact) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'isDone'>) => Promise<string>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  
  // Reminder Actions
  addReminder: (reminder: Omit<Reminder, 'id' | 'isRead' | 'isSnoozed'>) => Promise<string>;
  updateReminder: (reminder: Reminder) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [allJobs, allStatuses, allContacts, allTasks, allReminders] = await Promise.all([
        jobsDb.getAllJobs(),
        statusesDb.getAllStatuses(),
        contactsDb.getAllContacts(),
        tasksDb.getAllTasks(),
        remindersDb.getAllReminders()
      ]);
      setJobs(allJobs);
      setStatuses(allStatuses);
      setContacts(allContacts);
      setTasks(allTasks);
      setReminders(allReminders);
    } catch (err) {
      console.error('Failed to sync state with IndexedDB:', err);
      setError('Failed to load database. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Job Actions
  const addJob = async (jobData: Omit<Job, 'id' | 'dateAdded' | 'isDuplicate' | 'statusHistory' | 'isArchived'>): Promise<string> => {
    const id = uuidv4();
    const newJob: Job = {
      ...jobData,
      id,
      dateAdded: Date.now(),
      isArchived: false,
      isDuplicate: false,
      statusHistory: []
    };
    await jobsDb.saveJob(newJob);
    await refreshAll();
    return id;
  };

  const updateJob = async (job: Job): Promise<void> => {
    await jobsDb.saveJob(job);
    await refreshAll();
  };

  const deleteJob = async (id: string): Promise<void> => {
    // Also delete references: unlink contacts or delete tasks associated with this job if needed, or keep them.
    // For clean cleanup:
    await jobsDb.deleteJob(id);
    await refreshAll();
  };

  const archiveJob = async (id: string): Promise<void> => {
    const job = jobs.find(j => j.id === id);
    if (job) {
      await jobsDb.saveJob({ ...job, isArchived: true });
      await refreshAll();
    }
  };

  // Status Actions
  const addStatus = async (statusData: Omit<Status, 'id'>): Promise<string> => {
    const id = `status-${uuidv4().substring(0, 8)}`;
    const newStatus: Status = {
      ...statusData,
      id
    };
    await statusesDb.saveStatus(newStatus);
    await refreshAll();
    return id;
  };

  const updateStatus = async (status: Status): Promise<void> => {
    await statusesDb.saveStatus(status);
    await refreshAll();
  };

  const deleteStatus = async (id: string): Promise<void> => {
    await statusesDb.deleteStatus(id);
    await refreshAll();
  };

  // Contact Actions
  const addContact = async (contactData: Omit<Contact, 'id'>): Promise<string> => {
    const id = uuidv4();
    const newContact: Contact = { ...contactData, id };
    await contactsDb.saveContact(newContact);
    await refreshAll();
    return id;
  };

  const updateContact = async (contact: Contact): Promise<void> => {
    await contactsDb.saveContact(contact);
    await refreshAll();
  };

  const deleteContact = async (id: string): Promise<void> => {
    await contactsDb.deleteContact(id);
    await refreshAll();
  };

  // Task Actions
  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'isDone'>): Promise<string> => {
    const id = uuidv4();
    const newTask: Task = {
      ...taskData,
      id,
      createdAt: Date.now(),
      isDone: false
    };
    await tasksDb.saveTask(newTask);
    await refreshAll();
    return id;
  };

  const updateTask = async (task: Task): Promise<void> => {
    await tasksDb.saveTask(task);
    await refreshAll();
  };

  const deleteTask = async (id: string): Promise<void> => {
    await tasksDb.deleteTask(id);
    await refreshAll();
  };

  const toggleTask = async (id: string): Promise<void> => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await tasksDb.saveTask({
        ...task,
        isDone: !task.isDone
      });
      await refreshAll();
    }
  };

  // Reminder Actions
  const addReminder = async (reminderData: Omit<Reminder, 'id' | 'isRead' | 'isSnoozed'>): Promise<string> => {
    const id = uuidv4();
    const newReminder: Reminder = {
      ...reminderData,
      id,
      isRead: false,
      isSnoozed: false
    };
    await remindersDb.saveReminder(newReminder);
    await refreshAll();
    return id;
  };

  const updateReminder = async (reminder: Reminder): Promise<void> => {
    await remindersDb.saveReminder(reminder);
    await refreshAll();
  };

  const deleteReminder = async (id: string): Promise<void> => {
    await remindersDb.deleteReminder(id);
    await refreshAll();
  };

  return React.createElement(
    JobsContext.Provider,
    {
      value: {
        jobs,
        statuses,
        contacts,
        tasks,
        reminders,
        loading,
        error,
        refreshAll,
        addJob,
        updateJob,
        deleteJob,
        archiveJob,
        addStatus,
        updateStatus,
        deleteStatus,
        addContact,
        updateContact,
        deleteContact,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        addReminder,
        updateReminder,
        deleteReminder
      }
    },
    children
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};
