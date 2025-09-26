import React, { useState, useEffect } from 'react';
import { settingsManager, type UserSettings } from '../utils/settingsManager';
import './Settings.css';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      return settingsManager.getSettings();
    } catch (error) {
      console.error('Error loading settings:', error);
      // Return default settings if there's an error
      return {
        defaultQuizMode: 'multiple-choice',
        defaultQuestionCount: 10,
        enableTimer: false,
        defaultTimeLimit: 30,
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
        theme: 'light',
        fontSize: 'medium',
        showHints: true,
        showProgress: true,
        showDifficulty: true,
        enableSounds: false,
        soundVolume: 0.5,
        enableHapticFeedback: true,
        enableNotifications: false,
        studyReminders: false,
        reminderTime: '19:00',
        reminderDays: [1, 2, 3, 4, 5],
        autoSave: true,
        dataRetention: 365,
        enableAnalytics: true,
        enableCrashReporting: false,
      };
    }
  });
  const [activeCategory, setActiveCategory] = useState<string>('quiz');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Apply settings when component mounts
    try {
      settingsManager.applySettings();
    } catch (error) {
      console.error('Error applying settings:', error);
    }
  }, []);

  const categories = (() => {
    try {
      return settingsManager.getSettingsCategories();
    } catch (error) {
      console.error('Error loading settings categories:', error);
      return {
        quiz: {
          title: 'Quiz Settings',
          icon: '🧠',
          settings: ['defaultQuizMode', 'defaultQuestionCount', 'enableTimer', 'defaultTimeLimit']
        }
      };
    }
  })();

  const handleSettingChange = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setHasChanges(true);
  };

  const saveSettings = () => {
    settingsManager.updateSettings(settings);
    setHasChanges(false);
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      settingsManager.resetSettings();
      setSettings(settingsManager.getSettings());
      setHasChanges(false);
    }
  };

  const exportSettings = () => {
    const data = settingsManager.exportSettings();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcard-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonString = e.target?.result as string;
          if (settingsManager.importSettings(jsonString)) {
            setSettings(settingsManager.getSettings());
            setHasChanges(false);
            alert('Settings imported successfully!');
          } else {
            alert('Failed to import settings. Invalid file format.');
          }
        } catch (error) {
          alert('Error reading file: ' + error);
        }
      };
      reader.readAsText(file);
    }
  };

  const renderSetting = (key: keyof UserSettings) => {
    const value = settings[key];

    switch (key) {
      case 'defaultQuizMode':
        return (
          <div className="setting-item">
            <label className="setting-label">Default Quiz Mode</label>
            <select
              value={value as string}
              onChange={(e) => handleSettingChange(key, e.target.value as 'multiple-choice' | 'fill-in-blank')}
              className="setting-input"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="fill-in-blank">Fill in the Blank</option>
            </select>
          </div>
        );

      case 'defaultQuestionCount':
        return (
          <div className="setting-item">
            <label className="setting-label">Default Question Count</label>
            <input
              type="number"
              min="5"
              max="50"
              value={value as number}
              onChange={(e) => handleSettingChange(key, parseInt(e.target.value))}
              className="setting-input"
            />
          </div>
        );

      case 'enableTimer':
      case 'enableAdaptiveDifficulty':
      case 'showHints':
      case 'showProgress':
      case 'showDifficulty':
      case 'enableSounds':
      case 'enableHapticFeedback':
      case 'enableNotifications':
      case 'studyReminders':
      case 'autoSave':
      case 'enableAnalytics':
      case 'enableCrashReporting':
        return (
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => handleSettingChange(key, e.target.checked)}
                className="setting-checkbox"
              />
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
          </div>
        );

      case 'defaultTimeLimit':
        return (
          <div className="setting-item">
            <label className="setting-label">Default Time Limit (seconds)</label>
            <input
              type="number"
              min="10"
              max="300"
              value={value as number}
              onChange={(e) => handleSettingChange(key, parseInt(e.target.value))}
              className="setting-input"
              disabled={!settings.enableTimer}
            />
          </div>
        );

      case 'difficultyAdjustmentSpeed':
        return (
          <div className="setting-item">
            <label className="setting-label">Difficulty Adjustment Speed</label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={value as number}
              onChange={(e) => handleSettingChange(key, parseFloat(e.target.value))}
              className="setting-slider"
            />
            <span className="setting-value">{value}</span>
          </div>
        );

      case 'minimumQuestionsForAdjustment':
        return (
          <div className="setting-item">
            <label className="setting-label">Minimum Questions for Adjustment</label>
            <input
              type="number"
              min="3"
              max="20"
              value={value as number}
              onChange={(e) => handleSettingChange(key, parseInt(e.target.value))}
              className="setting-input"
            />
          </div>
        );

      case 'performanceWindow':
        return (
          <div className="setting-item">
            <label className="setting-label">Performance Window (questions)</label>
            <input
              type="number"
              min="5"
              max="50"
              value={value as number}
              onChange={(e) => handleSettingChange(key, parseInt(e.target.value))}
              className="setting-input"
            />
          </div>
        );

      case 'theme':
        return (
          <div className="setting-item">
            <label className="setting-label">Theme</label>
            <select
              value={value as string}
              onChange={(e) => handleSettingChange(key, e.target.value as 'light' | 'dark' | 'auto')}
              className="setting-input"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
        );

      case 'fontSize':
        return (
          <div className="setting-item">
            <label className="setting-label">Font Size</label>
            <select
              value={value as string}
              onChange={(e) => handleSettingChange(key, e.target.value as 'small' | 'medium' | 'large')}
              className="setting-input"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        );

      case 'soundVolume':
        return (
          <div className="setting-item">
            <label className="setting-label">Sound Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={value as number}
              onChange={(e) => handleSettingChange(key, parseFloat(e.target.value))}
              className="setting-slider"
              disabled={!settings.enableSounds}
            />
            <span className="setting-value">{Math.round((value as number) * 100)}%</span>
          </div>
        );

      case 'reminderTime':
        return (
          <div className="setting-item">
            <label className="setting-label">Reminder Time</label>
            <input
              type="time"
              value={value as string}
              onChange={(e) => handleSettingChange(key, e.target.value)}
              className="setting-input"
              disabled={!settings.studyReminders}
            />
          </div>
        );

      case 'reminderDays':
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return (
          <div className="setting-item">
            <label className="setting-label">Reminder Days</label>
            <div className="days-selector">
              {days.map((day, index) => (
                <label key={index} className="day-option">
                  <input
                    type="checkbox"
                    checked={(value as number[]).includes(index)}
                    onChange={(e) => {
                      const currentDays = value as number[];
                      const newDays = e.target.checked
                        ? [...currentDays, index]
                        : currentDays.filter(d => d !== index);
                      handleSettingChange(key, newDays);
                    }}
                    className="day-checkbox"
                    disabled={!settings.studyReminders}
                  />
                  {day.slice(0, 3)}
                </label>
              ))}
            </div>
          </div>
        );

      case 'dataRetention':
        return (
          <div className="setting-item">
            <label className="setting-label">Data Retention (days)</label>
            <input
              type="number"
              min="30"
              max="3650"
              value={value as number}
              onChange={(e) => handleSettingChange(key, parseInt(e.target.value))}
              className="setting-input"
            />
          </div>
        );

      case 'enabledTenses':
        const allTenses = [
          { key: 'pretérito_perfeito', label: 'Pretérito Perfeito (Simple Past)' },
          { key: 'pretérito_imperfeito', label: 'Pretérito Imperfeito (Imperfect Past)' },
          { key: 'pretérito_mais_que_perfeito', label: 'Pretérito Mais-que-perfeito (Pluperfect)' },
          { key: 'futuro_do_presente', label: 'Futuro do Presente (Simple Future)' },
          { key: 'futuro_do_pretérito', label: 'Futuro do Pretérito (Conditional)' },
          { key: 'presente_do_subjuntivo', label: 'Presente do Subjuntivo (Present Subjunctive)' },
          { key: 'imperfeito_do_subjuntivo', label: 'Imperfeito do Subjuntivo (Imperfect Subjunctive)' },
          { key: 'futuro_do_subjuntivo', label: 'Futuro do Subjuntivo (Future Subjunctive)' },
          { key: 'pluscuamperfecto_do_subjuntivo', label: 'Pluscuamperfecto do Subjuntivo (Pluperfect Subjunctive)' }
        ];
        
        return (
          <div className="setting-item">
            <label className="setting-label">Enabled Verb Tenses</label>
            <div className="tenses-selector">
              {allTenses.map((tense) => (
                <label key={tense.key} className="tense-option">
                  <input
                    type="checkbox"
                    checked={(value as string[]).includes(tense.key)}
                    onChange={(e) => {
                      const currentTenses = value as string[];
                      const newTenses = e.target.checked
                        ? [...currentTenses, tense.key]
                        : currentTenses.filter(t => t !== tense.key);
                      handleSettingChange(key, newTenses);
                    }}
                    className="tense-checkbox"
                  />
                  <span className="tense-label">{tense.label}</span>
                </label>
              ))}
            </div>
            <p className="setting-hint">
              Select which verb tenses you want to focus on during study and quiz sessions.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Customize your learning experience</p>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <h3>Categories</h3>
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              className={`category-button ${activeCategory === key ? 'active' : ''}`}
              onClick={() => setActiveCategory(key)}
            >
              <span className="category-icon">{category.icon}</span>
              {category.title}
            </button>
          ))}
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h2>
              <span className="section-icon">{categories[activeCategory as keyof typeof categories]?.icon}</span>
              {categories[activeCategory as keyof typeof categories]?.title}
            </h2>
            
            <div className="settings-form">
              {categories[activeCategory as keyof typeof categories]?.settings.map((settingKey) => (
                <div key={settingKey}>
                  {renderSetting(settingKey as keyof UserSettings)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <div className="settings-actions">
          <button onClick={resetSettings} className="action-button reset-button">
            🔄 Reset to Defaults
          </button>
          <button onClick={exportSettings} className="action-button export-button">
            📤 Export Settings
          </button>
          <label className="action-button import-button">
            📥 Import Settings
            <input type="file" accept=".json" onChange={importSettings} style={{ display: 'none' }} />
          </label>
          {hasChanges && (
            <button onClick={saveSettings} className="action-button save-button">
              💾 Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
