import { useEffect, useState } from 'react';

import { cn } from '@/utils/cn';
import { type GuideSection } from '@/types/content';

type GuideTableOfContentsProps = {
  sections: GuideSection[];
};

/**
 * Sticky table of contents with scroll-spy active-section highlighting.
 * Uses an IntersectionObserver to mark the section currently in view as
 * active, with the last intersecting section winning when several are
 * visible. Keyboard focus also activates the matching entry for
 * accessibility parity.
 */
export function GuideTableOfContents({ sections }: GuideTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-96px 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Guide table of contents"
      className="sticky top-28 rounded-panel border border-white/10 bg-white/[0.04] p-5 shadow-panel backdrop-blur-xl"
    >
      <h2 className="text-sm font-bold text-white">On this page</h2>
      <ol className="mt-4 space-y-1">
        {sections.map((section, index) => {
          const isActive = activeId === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'group relative block rounded-xl py-2 pl-4 pr-3 text-sm transition',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  isActive
                    ? 'bg-neon-cyan/[0.08] font-semibold text-white'
                    : 'text-text-secondary hover:bg-white/[0.06] hover:text-white',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full transition',
                    isActive ? 'bg-neon-cyan' : 'bg-transparent',
                  )}
                />
                <span className="mr-2 text-xs text-text-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {section.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
