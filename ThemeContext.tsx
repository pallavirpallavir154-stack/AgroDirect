import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WebsiteTheme, WebsiteContent } from '../../shared/types';
import { DEFAULT_WEBSITE_THEME, DEFAULT_WEBSITE_CONTENT } from '../../shared/constants';

interface ThemeContextType {
  theme: WebsiteTheme;
  content: WebsiteContent;
  refreshThemeAndContent: () => Promise<void>;
  updateLiveTheme: (newTheme: Partial<WebsiteTheme>) => void;
  updateLiveContent: (newContent: Partial<WebsiteContent>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<WebsiteTheme>(() => {
    try {
      const cached = localStorage.getItem('agrodirect_theme');
      return cached ? JSON.parse(cached) : DEFAULT_WEBSITE_THEME;
    } catch {
      return DEFAULT_WEBSITE_THEME;
    }
  });

  const [content, setContent] = useState<WebsiteContent>(() => {
    try {
      const cached = localStorage.getItem('agrodirect_content');
      return cached ? JSON.parse(cached) : DEFAULT_WEBSITE_CONTENT;
    } catch {
      return DEFAULT_WEBSITE_CONTENT;
    }
  });

  const refreshThemeAndContent = useCallback(async () => {
    try {
      // Safe fetch helper that doesn't throw unhandled exceptions
      const safeFetch = async (url: string) => {
        try {
          const res = await fetch(url);
          if (res.ok) {
            return await res.json();
          }
          return null;
        } catch {
          return null;
        }
      };

      const [themeData, contentData] = await Promise.all([
        safeFetch('/api/theme').then((data) => data || safeFetch('/api/admin/theme')),
        safeFetch('/api/content').then((data) => data || safeFetch('/api/admin/content')),
      ]);

      if (themeData) {
        setTheme((prev) => {
          const updated = { ...prev, ...themeData };
          try {
            localStorage.setItem('agrodirect_theme', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }

      if (contentData) {
        setContent((prev) => {
          const updated = { ...prev, ...contentData };
          try {
            localStorage.setItem('agrodirect_content', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    } catch {
      // Fallback gracefully without breaking UI
    }
  }, []);

  useEffect(() => {
    refreshThemeAndContent();
  }, [refreshThemeAndContent]);

  const updateLiveTheme = (newTheme: Partial<WebsiteTheme>) => {
    setTheme((prev) => {
      const updated = { ...prev, ...newTheme };
      try {
        localStorage.setItem('agrodirect_theme', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateLiveContent = (newContent: Partial<WebsiteContent>) => {
    setContent((prev) => {
      const updated = { ...prev, ...newContent };
      try {
        localStorage.setItem('agrodirect_content', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        content,
        refreshThemeAndContent,
        updateLiveTheme,
        updateLiveContent,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
