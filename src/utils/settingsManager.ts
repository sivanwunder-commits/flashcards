export interface UserSettings {
  // Quiz Settings
  defaultQuizMode: 'multiple-choice' | 'fill-in-blank';
  defaultQuestionCount: number;
  enableTimer: boolean;
  defaultTimeLimit: number; // in seconds
  
  // Study Settings
  enableAdaptiveDifficulty: boolean;
  difficultyAdjustmentSpeed: number; // 0.1 to 1.0
  minimumQuestionsForAdjustment: number;
  performanceWindow: number; // Number of recent questions to consider
  enabledTenses: string[]; // Array of enabled tense keys
  
  // Display Settings
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  showHints: boolean;
  showProgress: boolean;
  showDifficulty: boolean;
  
  // Audio Settings
  enableSounds: boolean;
  soundVolume: number; // 0 to 1
  enableHapticFeedback: boolean;
  
  // Notification Settings
  enableNotifications: boolean;
  studyReminders: boolean;
  reminderTime: string; // HH:MM format
  reminderDays: number[]; // Array of day numbers (0-6, Sunday = 0)
  
  // Advanced Settings
  autoSave: boolean;
  dataRetention: number; // days
  enableAnalytics: boolean;
  enableCrashReporting: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  // Quiz Settings
  defaultQuizMode: 'multiple-choice',
  defaultQuestionCount: 10,
  enableTimer: false,
  defaultTimeLimit: 30,
  
  // Study Settings
  enableAdaptiveDifficulty: true,
  difficultyAdjustmentSpeed: 0.3,
  minimumQuestionsForAdjustment: 5,
  performanceWindow: 10,
  enabledTenses: [
    'pretérito_perfeito',
    'pretérito_imperfeito',
    'futuro_do_presente',
    'presente_do_subjuntivo',
    'imperfeito_do_subjuntivo'
  ],
  
  // Display Settings
  theme: 'light',
  fontSize: 'medium',
  showHints: true,
  showProgress: true,
  showDifficulty: true,
  
  // Audio Settings
  enableSounds: false,
  soundVolume: 0.5,
  enableHapticFeedback: true,
  
  // Notification Settings
  enableNotifications: false,
  studyReminders: false,
  reminderTime: '19:00',
  reminderDays: [1, 2, 3, 4, 5], // Monday to Friday
  
  // Advanced Settings
  autoSave: true,
  dataRetention: 365,
  enableAnalytics: true,
  enableCrashReporting: false,
};

const STORAGE_KEY = 'flashcard_user_settings';

class SettingsManager {
  private settings: UserSettings;

  constructor() {
    this.settings = this.loadSettings();
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): UserSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        // Merge with defaults to ensure all properties exist
        return { ...DEFAULT_SETTINGS, ...parsedSettings };
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
    return { ...DEFAULT_SETTINGS };
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  }

  /**
   * Get current settings
   */
  getSettings(): UserSettings {
    return { ...this.settings };
  }

  /**
   * Update specific settings
   */
  updateSettings(updates: Partial<UserSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
    this.applySettingsInternal();
  }

  /**
   * Reset settings to defaults
   */
  resetSettings(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
    this.applySettingsInternal();
  }

  /**
   * Get a specific setting value
   */
  getSetting<K extends keyof UserSettings>(key: K): UserSettings[K] {
    return this.settings[key];
  }

  /**
   * Set a specific setting value
   */
  setSetting<K extends keyof UserSettings>(key: K, value: UserSettings[K]): void {
    this.settings[key] = value;
    this.saveSettings();
    this.applySettingsInternal();
  }

  /**
   * Apply settings to the application
   */
  private applySettingsInternal(): void {
    // Only apply settings if we're in a browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.applyTheme();
      this.applyFontSize();
      this.applyAudioSettings();
    }
  }

  /**
   * Apply theme settings
   */
  private applyTheme(): void {
    if (typeof document === 'undefined') return;
    
    const { theme } = this.settings;
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else if (theme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    } else {
      // Auto theme - use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark-theme');
        root.classList.remove('light-theme');
      } else {
        root.classList.add('light-theme');
        root.classList.remove('dark-theme');
      }
    }
  }

  /**
   * Apply font size settings
   */
  private applyFontSize(): void {
    if (typeof document === 'undefined') return;
    
    const { fontSize } = this.settings;
    const root = document.documentElement;
    
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${fontSize}`);
  }

  /**
   * Apply audio settings
   */
  private applyAudioSettings(): void {
    // This would be implemented if we add audio features
    // For now, just store the preference
  }

  /**
   * Export settings as JSON
   */
  exportSettings(): string {
    return JSON.stringify(this.settings, null, 2);
  }

  /**
   * Import settings from JSON
   */
  importSettings(jsonString: string): boolean {
    try {
      const importedSettings = JSON.parse(jsonString);
      
      // Validate that it's a proper settings object
      if (typeof importedSettings === 'object' && importedSettings !== null) {
        this.settings = { ...DEFAULT_SETTINGS, ...importedSettings };
        this.saveSettings();
        this.applySettingsInternal();
        return true;
      }
    } catch (error) {
      console.error('Failed to import settings:', error);
    }
    return false;
  }

  /**
   * Public method to apply settings (for external use)
   */
  public applySettings(): void {
    this.applySettingsInternal();
  }

  /**
   * Get settings categories for UI organization
   */
  getSettingsCategories() {
    return {
      quiz: {
        title: 'Quiz Settings',
        icon: '🧠',
        settings: [
          'defaultQuizMode',
          'defaultQuestionCount',
          'enableTimer',
          'defaultTimeLimit'
        ]
      },
      study: {
        title: 'Study Settings',
        icon: '📚',
        settings: [
          'enableAdaptiveDifficulty',
          'difficultyAdjustmentSpeed',
          'minimumQuestionsForAdjustment',
          'performanceWindow',
          'enabledTenses'
        ]
      },
      display: {
        title: 'Display Settings',
        icon: '🎨',
        settings: [
          'theme',
          'fontSize',
          'showHints',
          'showProgress',
          'showDifficulty'
        ]
      },
      audio: {
        title: 'Audio & Feedback',
        icon: '🔊',
        settings: [
          'enableSounds',
          'soundVolume',
          'enableHapticFeedback'
        ]
      },
      notifications: {
        title: 'Notifications',
        icon: '🔔',
        settings: [
          'enableNotifications',
          'studyReminders',
          'reminderTime',
          'reminderDays'
        ]
      },
      advanced: {
        title: 'Advanced',
        icon: '⚙️',
        settings: [
          'autoSave',
          'dataRetention',
          'enableAnalytics',
          'enableCrashReporting'
        ]
      }
    };
  }
}

// Lazy initialization to avoid issues during SSR or initial load
let settingsManagerInstance: SettingsManager | null = null;

export const settingsManager = {
  getInstance(): SettingsManager {
    if (!settingsManagerInstance) {
      settingsManagerInstance = new SettingsManager();
    }
    return settingsManagerInstance;
  },
  
  // Proxy methods to the instance
  getSettings(): UserSettings {
    return this.getInstance().getSettings();
  },
  
  updateSettings(updates: Partial<UserSettings>): void {
    this.getInstance().updateSettings(updates);
  },
  
  resetSettings(): void {
    this.getInstance().resetSettings();
  },
  
  getSetting<K extends keyof UserSettings>(key: K): UserSettings[K] {
    return this.getInstance().getSetting(key);
  },
  
  setSetting<K extends keyof UserSettings>(key: K, value: UserSettings[K]): void {
    this.getInstance().setSetting(key, value);
  },
  
  applySettings(): void {
    this.getInstance().applySettings();
  },
  
  exportSettings(): string {
    return this.getInstance().exportSettings();
  },
  
  importSettings(jsonString: string): boolean {
    return this.getInstance().importSettings(jsonString);
  },
  
  getSettingsCategories() {
    return this.getInstance().getSettingsCategories();
  }
};
