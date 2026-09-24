import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CornerDownLeft, Home, Layers, Map, Moon, Search } from 'lucide-react';
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router';

import { ROUTES } from '@/constants/routes';
import { SITE_CONFIG } from '@/constants/site';
import { useBodyScrollLock, useEscapeKey } from '@/hooks';
import { cn } from '@/utils/cn';

export type CommandGroup = 'Navigate' | 'Dashboard' | 'Admin' | 'Actions';

type Command = {
  id: string;
  label: string;
  hint?: string;
  group: CommandGroup;
  icon: ReactNode;
  shortcut?: string;
  action: () => void;
};

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  /**
   * Context-specific commands injected by the mounting layout (e.g. the
   * AdminLayout passes manage-guides / manage-users commands; the
   * UserLayout passes dashboard/bookmarks/settings commands). Merged ahead
   * of the default Navigate + Actions groups.
   */
  extraCommands?: Command[];
};

const NAV_ICON_CLASS = 'size-4';

const NAV_ITEMS = [
  {
    label: 'Home',
    hint: 'Homepage',
    icon: <Home aria-hidden className={NAV_ICON_CLASS} />,
    href: ROUTES.home,
  },
  {
    label: 'Guides',
    hint: 'Browse all guides',
    icon: <Layers aria-hidden className={NAV_ICON_CLASS} />,
    href: ROUTES.guides,
  },
  {
    label: 'Categories',
    hint: 'Browse by category',
    icon: <Layers aria-hidden className={NAV_ICON_CLASS} />,
    href: ROUTES.categories,
  },
  {
    label: 'Map',
    hint: 'Interactive Vice City map',
    icon: <Map aria-hidden className={NAV_ICON_CLASS} />,
    href: ROUTES.map,
  },
  {
    label: 'Search',
    hint: 'Search guides',
    icon: <Search aria-hidden className={NAV_ICON_CLASS} />,
    href: ROUTES.search,
  },
];

// Display order for command groups. Groups not present in the merged
// command list are simply skipped during render.
const GROUP_ORDER: CommandGroup[] = ['Admin', 'Dashboard', 'Navigate', 'Actions'];

function fuzzyMatch(query: string, label: string, hint?: string) {
  if (!query) {
    return true;
  }
  const q = query.toLowerCase();
  if (label.toLowerCase().includes(q)) {
    return true;
  }
  return Boolean(hint && hint.toLowerCase().includes(q));
}

export function CommandPalette({ open, onClose, extraCommands = [] }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const go = useCallback(
    (href: string) => {
      navigate(href);
      onClose();
    },
    [navigate, onClose],
  );

  const commands = useMemo<Command[]>(() => {
    const navCommands: Command[] = NAV_ITEMS.map((item) => ({
      id: `nav-${item.href}`,
      label: item.label,
      hint: item.hint,
      group: 'Navigate',
      icon: item.icon,
      action: () => go(item.href),
    }));

    const actionCommands: Command[] = [
      {
        id: 'action-search',
        label: 'Search guides',
        hint: 'Jump to the search page',
        group: 'Actions',
        icon: <Search aria-hidden className={NAV_ICON_CLASS} />,
        shortcut: '/',
        action: () => go(ROUTES.search),
      },
      {
        id: 'action-back-to-top',
        label: 'Scroll back to top',
        hint: 'Smooth scroll to the top of the page',
        group: 'Actions',
        icon: <Moon aria-hidden className={NAV_ICON_CLASS} />,
        action: () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          onClose();
        },
      },
    ];

    // Context commands first (Admin / Dashboard), then nav, then actions —
    // matches GROUP_ORDER so the most relevant commands surface on top.
    return [...extraCommands, ...navCommands, ...actionCommands];
  }, [extraCommands, go, onClose]);

  const filtered = useMemo(
    () => commands.filter((c) => fuzzyMatch(query, c.label, c.hint)),
    [commands, query],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useBodyScrollLock(open);
  useEscapeKey({ enabled: open, onEscape: onClose });

  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((current) => Math.min(current + 1, filtered.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((current) => Math.max(current - 1, 0));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const command = filtered[activeIndex];
        if (command) {
          command.action();
        }
      }
    },
    [filtered, activeIndex],
  );

  if (!open) {
    return null;
  }

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, command) => {
    (acc[command.group] ??= []).push(command);
    return acc;
  }, {});
  const presentGroups = GROUP_ORDER.filter((g) => grouped[g]?.length);
  let flatIndex = -1;

  return (
    <AnimatePresence>
      <motion.div
        key="command-palette-overlay"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1 }}
        exit={shouldReduceMotion ? undefined : { opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -12, scale: 0.98 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onClick={(event) => event.stopPropagation()}
          className="w-full max-w-xl overflow-hidden rounded-shell border border-white/10 bg-surface/95 shadow-panel backdrop-blur-2xl"
        >
          <div className="flex items-center gap-3 border-b border-white/10 px-4">
            <Search aria-hidden className="size-5 text-text-muted" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search commands and routes…"
              aria-label="Search commands"
              className="h-14 flex-1 bg-transparent text-sm text-white placeholder:text-text-muted focus:outline-none"
            />
            <kbd className="hidden rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-semibold text-text-muted sm:inline">
              Esc
            </kbd>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-text-muted">
                No commands match “{query}”.
              </p>
            ) : (
              presentGroups.map((group) => (
                <div key={group} className="mb-2">
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                    {group}
                  </p>
                  {grouped[group].map((command) => {
                    flatIndex++;
                    const isActive = flatIndex === activeIndex;
                    return (
                      <button
                        key={command.id}
                        type="button"
                        onMouseEnter={() => setActiveIndex(flatIndex)}
                        onClick={command.action}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition',
                          isActive
                            ? 'bg-neon-cyan/[0.08] text-white'
                            : 'text-text-secondary hover:bg-white/[0.04] hover:text-white',
                        )}
                      >
                        <span
                          className={cn(
                            'grid size-8 shrink-0 place-items-center rounded-lg border',
                            isActive
                              ? 'border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan'
                              : 'border-white/10 bg-white/[0.04] text-text-muted',
                          )}
                        >
                          {command.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-white">{command.label}</span>
                          {command.hint ? (
                            <span className="mt-0.5 block text-xs text-text-muted">
                              {command.hint}
                            </span>
                          ) : null}
                        </span>
                        {command.shortcut ? (
                          <kbd className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-semibold text-text-muted">
                            {command.shortcut}
                          </kbd>
                        ) : isActive ? (
                          <CornerDownLeft aria-hidden className="size-4 text-neon-cyan" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[11px] text-text-muted">
            <span className="flex items-center gap-2">
              <ArrowRight aria-hidden className="size-3" />
              {SITE_CONFIG.name}
            </span>
            <span className="flex items-center gap-3">
              <span>
                <kbd className="rounded border border-white/10 px-1 text-[10px]">↑</kbd>{' '}
                <kbd className="rounded border border-white/10 px-1 text-[10px]">↓</kbd> navigate
              </span>
              <span>
                <kbd className="rounded border border-white/10 px-1 text-[10px]">↵</kbd> select
              </span>
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
