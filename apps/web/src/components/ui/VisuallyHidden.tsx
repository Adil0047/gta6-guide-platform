import { type ElementType, type ReactNode } from 'react';

type VisuallyHiddenProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children'>;

/**
 * Renders content that is visually hidden but available to assistive
 * technology and the accessibility tree. Use the `as` prop to control the
 * underlying element (e.g. `as="h1"` for an accessible page heading that is
 * not shown visually). Defaults to a `<span>` for inline use.
 */
export function VisuallyHidden<T extends ElementType = 'span'>({
  as,
  children,
  ...rest
}: VisuallyHiddenProps<T>) {
  const Component = (as ?? 'span') as ElementType;
  return (
    <Component className="sr-only" {...rest}>
      {children}
    </Component>
  );
}
