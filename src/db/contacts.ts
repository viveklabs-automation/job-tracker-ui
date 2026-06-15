// filepath: src/db/contacts.ts

import { dbPromise } from './index';
import type { Contact } from '../types';

export async function getAllContacts(): Promise<Contact[]> {
  try {
    const db = await dbPromise;
    return await db.getAll('contacts');
  } catch (error) {
    console.error('Failed to get contacts from IndexedDB:', error);
    throw error;
  }
}

export async function getContact(id: string): Promise<Contact | undefined> {
  try {
    const db = await dbPromise;
    return await db.get('contacts', id);
  } catch (error) {
    console.error(`Failed to get contact ${id} from IndexedDB:`, error);
    throw error;
  }
}

export async function saveContact(contact: Contact): Promise<void> {
  try {
    const db = await dbPromise;
    await db.put('contacts', contact);
  } catch (error) {
    console.error('Failed to save contact in IndexedDB:', error);
    throw error;
  }
}

export async function deleteContact(id: string): Promise<void> {
  try {
    const db = await dbPromise;
    await db.delete('contacts', id);
  } catch (error) {
    console.error(`Failed to delete contact ${id} from IndexedDB:`, error);
    throw error;
  }
}
