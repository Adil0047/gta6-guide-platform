import { storage } from '@/lib/storage';

export type ThemePreference = 'dark' | 'system' | 'light';

const THEME_STORAGE_KEY = 'gta6-guide-theme';

export const themeStore = {
  getTheme(): ThemePreference {
    const storedTheme = storage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === 'dark' || storedTheme === 'system' || storedTheme === 'light') {
      return storedTheme;
    }

    return 'dark';
  },

  setTheme(theme: ThemePreference) {
    storage.setItem(THEME_STORAGE_KEY, theme);
  },
};
