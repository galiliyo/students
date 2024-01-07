import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  saveToLocalStorage(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true; // Successful save
    } catch (error) {
      console.error('Error saving to local storage:', error);
      return false; // Failed save
    }
  }

  getFromLocalStorage(key: string) {
    try {
      const data = localStorage.getItem(key);
      return data !== null ? JSON.parse(data) : null; // Parse JSON data or return null if it's null
    } catch (error) {
      console.error('Error getting data from local storage:', error);
      return null;
    }
  }

  clearLocalStorage(key: string) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error clearing local storage:', error);
      return false;
    }
  }
}
