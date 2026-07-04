import slugifyModule from 'slugify';

type Slugify = (
  value: string,
  options?: {
    lower?: boolean;
    strict?: boolean;
    trim?: boolean;
  },
) => string;

const slugify = slugifyModule as unknown as Slugify;

export function createSlug(value: string): string {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function isValidSlug(value: string): boolean {
  return createSlug(value) === value;
}
