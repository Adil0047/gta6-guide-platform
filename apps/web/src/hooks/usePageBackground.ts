import { useEffect } from 'react';

/**
 * Sets a `data-bg` attribute on `<body>` that the CSS uses to select the
 * fixed page background image. Call this from a page component with the
 * page's background key. On unmount, resets to "default" so the next page
 * doesn't inherit the wrong background.
 *
 * Supported keys (defined in index.css): "home" | "guides" | "map" |
 * "categories" | "default".
 *
 * On mobile (< 768px) the CSS always uses bg-mobile.jpg regardless of this
 * key, so callers don't need to handle mobile specially.
 */
export function usePageBackground(key: 'home' | 'guides' | 'map' | 'categories' | 'default') {
  useEffect(() => {
    document.body.setAttribute('data-bg', key);
    return () => {
      document.body.setAttribute('data-bg', 'default');
    };
  }, [key]);
}
