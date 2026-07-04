import { GUIDE_DIFFICULTY_VALUES, GUIDE_TYPE_VALUES } from '@gta6-guide/shared/content';
import { Filter } from 'lucide-react';

import { Select } from '@/components/ui/Select';
import { type Category } from '@/types/content';

export type GuideFilterState = {
  category: string;
  difficulty: string;
  type: string;
};

type GuideFilterPanelProps = {
  categories: Category[];
  value: GuideFilterState;
  onChange: (value: GuideFilterState) => void;
};

const difficulties = GUIDE_DIFFICULTY_VALUES;
const guideTypes = GUIDE_TYPE_VALUES;

export function GuideFilterPanel({ categories, value, onChange }: GuideFilterPanelProps) {
  return (
    <aside className="rounded-panel border border-white/10 bg-white/[0.04] p-5 shadow-panel backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-neon-cyan">
          <Filter aria-hidden className="size-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Filter guides</h2>
          <p className="text-xs text-text-muted">Refine the guide library.</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            Category
          </span>
          <Select
            value={value.category}
            onChange={(event) => {
              onChange({ ...value, category: event.target.value });
            }}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.title}
              </option>
            ))}
          </Select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            Difficulty
          </span>
          <Select
            value={value.difficulty}
            onChange={(event) => {
              onChange({ ...value, difficulty: event.target.value });
            }}
          >
            <option value="">All difficulties</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </Select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            Type
          </span>
          <Select
            value={value.type}
            onChange={(event) => {
              onChange({ ...value, type: event.target.value });
            }}
          >
            <option value="">All types</option>
            {guideTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </label>

        <button
          type="button"
          className="w-full rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-text-secondary transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={() => {
            onChange({ category: '', difficulty: '', type: '' });
          }}
        >
          Reset filters
        </button>
      </div>
    </aside>
  );
}
