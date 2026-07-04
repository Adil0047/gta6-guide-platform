import { type GuideSection } from '@/types/content';

type GuideTableOfContentsProps = {
  sections: GuideSection[];
};

export function GuideTableOfContents({ sections }: GuideTableOfContentsProps) {
  return (
    <nav
      aria-label="Guide table of contents"
      className="sticky top-28 rounded-panel border border-white/10 bg-white/[0.04] p-5 shadow-panel backdrop-blur-xl"
    >
      <h2 className="text-sm font-bold text-white">On this page</h2>
      <ol className="mt-4 space-y-3">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="block rounded-xl px-3 py-2 text-sm text-text-secondary transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
