import { useEffect, useState } from 'react';

/**
 * SSR-safe media query hook. Returns true if the query matches.
 * @param query e.g. '(max-width: 767px)'
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
    // eslint-disable-next-line
  }, [query]);

  return matches;
}

