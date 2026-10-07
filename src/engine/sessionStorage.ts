/**
 * Local Session Persistence for Yuktivya AI
 * Saves and restores user datasets and analytical models in browser storage
 * without transmitting any data over the network.
 */

export interface SavedSession {
  id: string;
  timestamp: string;
  productName: string;
  industry: string;
  datasetName: string;
  isSyntheticDemo: boolean;
  demoId?: string;
  dataSummary: {
    rowCount: number;
    columnCount: number;
    score: number;
  };
  state: {
    rawData: Record<string, any>[];
    cleanedData: Record<string, any>[];
    cleaningReport: any;
    stats: any[];
    correlations: any[];
    reviewIntel?: any;
    demandIntel: any;
    marketValue: any;
    competitorIntel: any;
    successScore: any;
  };
}

const STORAGE_KEY = 'yuktivya_saved_session';
const HISTORY_KEY = 'yuktivya_recent_history';

export class SessionStorageManager {
  static saveCurrentSession(session: Omit<SavedSession, 'id' | 'timestamp'>): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;

      const fullSession: SavedSession = {
        ...session,
        id: `sess_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
      };

      // Store active session
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullSession));

      // Update recent history list (keep last 5 metadata headers without full raw data to conserve quota)
      const existingHistory = this.getRecentHistory();
      const summaryItem = {
        id: fullSession.id,
        timestamp: fullSession.timestamp,
        productName: fullSession.productName,
        industry: fullSession.industry,
        datasetName: fullSession.datasetName,
        isSyntheticDemo: fullSession.isSyntheticDemo,
        demoId: fullSession.demoId,
        dataSummary: fullSession.dataSummary,
      };

      const updatedHistory = [summaryItem, ...existingHistory.filter((h) => h.productName !== fullSession.productName)].slice(0, 5);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

      return true;
    } catch (err) {
      console.warn('Could not persist session to localStorage (quota or disabled):', err);
      return false;
    }
  }

  static getActiveSession(): SavedSession | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static getRecentHistory(): any[] {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return [];
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static clearSession(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}
