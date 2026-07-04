import { type InputHTMLAttributes } from 'react';

import { FormField } from '@/components/forms';
import { Input } from '@/components/ui/Input';

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
};

export function AuthInput({ label, description, ...props }: AuthInputProps) {
  return (
    <FormField label={label} description={description}>
      {(fieldId, descriptionId) => (
        <Input id={fieldId} aria-describedby={descriptionId} {...props} />
      )}
    </FormField>
  );
}
