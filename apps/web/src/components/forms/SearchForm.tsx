import { Search } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants/routes';

type SearchFormProps = {
  initialValue?: string;
};

export function SearchForm({ initialValue = '' }: SearchFormProps) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      navigate(ROUTES.search);
      return;
    }

    navigate(`${ROUTES.search}?q=${encodeURIComponent(trimmedQuery)}`);
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="flex w-full flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-text-muted"
        />
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          placeholder="Search GTA VI guides"
          aria-label="Search GTA VI guides"
          className="pl-12"
        />
      </div>

      <Button type="submit" className="shrink-0">
        Search
      </Button>
    </form>
  );
}
