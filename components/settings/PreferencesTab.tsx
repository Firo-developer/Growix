'use client';

import {useState} from 'react';
import {cn} from '@/lib/utils';
import {Select} from '@/components/ui/Select';
import {useNotification} from '@/components/ui/Notification';

const themes = [
  {id: 'system', label: 'System'},
  {id: 'light', label: 'Light'},
  {id: 'dark', label: 'Dark'},
];

const languages = [
  {value: 'en', label: 'English'},
  {value: 'am', label: 'Amharic'},
  {value: 'ar', label: 'Arabic'},
  {value: 'zh', label: 'Chinese'},
  {value: 'da', label: 'Dansk'},
  {value: 'nl', label: 'Dutch'},
  {value: 'fr', label: 'French'},
  {value: 'de', label: 'German'},
  {value: 'el', label: 'Greek'},
  {value: 'he', label: 'Hebrew'},
  {value: 'hi', label: 'Hindi'},
  {value: 'id', label: 'Indonesian'},
  {value: 'it', label: 'Italian'},
  {value: 'ja', label: 'Japanese'},
  {value: 'ko', label: 'Korean'},
  {value: 'ms', label: 'Malay'},
  {value: 'pl', label: 'Polish'},
  {value: 'pt', label: 'Portuguese'},
  {value: 'ru', label: 'Russian'},
  {value: 'es', label: 'Spanish'},
  {value: 'sv', label: 'Swedish'},
  {value: 'th', label: 'Thai'},
  {value: 'tr', label: 'Turkish'},
  {value: 'uk', label: 'Ukrainian'},
  {value: 'vi', label: 'Vietnamese'},
];

function ThemePreview({theme}: {theme: string}) {
  return (
    <div className="h-24 rounded-t-xl overflow-hidden border-b border-border/40">
      {theme === 'system' && (
        <div className="flex h-full">
          <div className="flex-1 bg-gray p-2">
            <div className="flex gap-1 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-white/60 rounded w-3/4" />
              <div className="h-1.5 bg-white/40 rounded w-1/2" />
            </div>
          </div>
          <div className="flex-1 bg-zinc-800 p-2">
            <div className="flex gap-1 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-white/20 rounded w-3/4" />
              <div className="h-1.5 bg-white/10 rounded w-1/2" />
            </div>
          </div>
        </div>
      )}
      {theme === 'light' && (
        <div className="h-full bg-gray p-3">
          <div className="flex gap-1 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <div className="space-y-1.5">
            <div className="h-2 bg-white rounded w-3/4" />
            <div className="h-2 bg-white/70 rounded w-1/2" />
            <div className="h-2 bg-white/50 rounded w-2/3" />
          </div>
        </div>
      )}
      {theme === 'dark' && (
        <div className="h-full bg-zinc-800 p-3">
          <div className="flex gap-1 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <div className="space-y-1.5">
            <div className="h-2 bg-white/20 rounded w-3/4" />
            <div className="h-2 bg-white/10 rounded w-1/2" />
            <div className="h-2 bg-white/5 rounded w-2/3" />
          </div>
        </div>
      )}
    </div>
  );
}

export function PreferencesTab() {
  const [selectedTheme, setSelectedTheme] = useState('system');
  const [language, setLanguage] = useState('en');
  const {notify} = useNotification();

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    const label = languages.find((l) => l.value === value)?.label ?? value;
    notify(`Language changed to ${label}`, 'success');
  };

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-lg font-semibold text-heading mb-4">Display</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={cn(
                'relative bg-card rounded-xl border overflow-hidden text-left transition-all duration-300 cursor-pointer',
                selectedTheme === theme.id
                  ? 'border-heading ring-1 ring-heading'
                  : 'border-border/60 hover:border-border',
              )}>
              <ThemePreview theme={theme.id} />
              <div className="p-3 flex items-center justify-between">
                <span className="text-sm font-medium text-heading">{theme.label}</span>
                {selectedTheme === theme.id && (
                  <span className="w-5 h-5 rounded-full bg-heading flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                      <path d="M8.5 2.5L4 7L1.5 4.5" stroke="white" strokeWidth="1.5" fill="none" />
                    </svg>
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <Select
          label="Language"
          options={languages}
          value={language}
          onChange={handleLanguageChange}
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-heading mb-2">Notifications</h2>
        <p className="text-sm text-text">
          Choose how you would like to be notified about updates, invites and subscriptions.
        </p>
      </section>
    </div>
  );
}
