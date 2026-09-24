import { Search } from 'lucide-react';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants/routes';

type SearchFormProps = {
  initialValue?: string;
  /**
   * When true, the input is focused programmatically on mount (used on the
   * dedicated /search route so the `/` keyboard shortcut and direct
   * navigations land on a focused input). Uses a ref + useEffect rather
   * than the autoFocus attribute to stay compliant with screen-reader
   * guidance.
   */
  focusOnMount?: boolean;
};

export function SearchForm({ initialValue = '', focusOnMount = false }: SearchFormProps) {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (focusOnMount && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusOnMount]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      navigate(`${ROUTES.search}?q=${encodeURIComponent(trimmedQuery)}`);
      return;
    }

    navigate(ROUTES.search);
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="flex w-full flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-text-muted"
        />
        <Input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          placeholder="Search GTA VI guides"
          aria-label="Search GTA VI guides"
          data-search-input
          className="pl-12"
        />
      </div>

      <Button type="submit" className="shrink-0">
        Search
      </Button>
    </form>
  );
}
