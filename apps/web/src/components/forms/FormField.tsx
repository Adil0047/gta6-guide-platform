import { type ReactNode, useId } from 'react';

type FormFieldProps = {
  label: string;
  description?: string;
  error?: string;
  children: (fieldId: string, descriptionId: string | undefined, errorId: string | undefined) => ReactNode;
};

export function FormField({ label, description, error, children }: FormFieldProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-white">
        {label}
      </label>

      <div className="mt-2">{children(id, descriptionId, errorId)}</div>

      {description ? (
        <p id={descriptionId} className="mt-2 text-xs leading-5 text-text-muted">
          {description}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="mt-2 text-xs font-medium leading-5 text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
