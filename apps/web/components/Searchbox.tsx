'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { cn } from '@repo/ui/lib/utils';
import { SearchIcon, XIcon } from 'lucide-react';

interface SearchboxProps {
  value?: string;
  boxClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (value?: string) => void;
  onClear?: () => void;
  searchOnEnter?: boolean;
}

const createInputProps = (searchboxProps: SearchboxProps) => {
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {};
  inputProps.type = 'text';
  if (searchboxProps.value) inputProps.value = searchboxProps.value;
  if (searchboxProps.onChange) inputProps.onChange = searchboxProps.onChange;
  inputProps.className = cn(
    'border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto shadow-none bg-popover',
    searchboxProps.inputClassName,
  );
  if (searchboxProps.placeholder)
    inputProps.placeholder = searchboxProps.placeholder;
  return inputProps;
};

export default function Searchbox({
  value,
  boxClassName,
  inputClassName,
  placeholder,
  onChange,
  onSearch,
  onClear,
  searchOnEnter,
}: SearchboxProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchOnEnter) {
      onSearch?.(e.currentTarget.value);
    }
  };
  const inputProps = createInputProps({
    value,
    onChange,
    inputClassName,
    placeholder,
  });

  return (
    <div
      className={cn(
        'flex items-center py-2 px-2 bg-muted rounded-full',
        boxClassName,
      )}
    >
      <div
        onClick={() => {
          onSearch?.(value);
        }}
      >
        <SearchIcon className="w-4 h-4 mr-2" />
      </div>
      <Input {...inputProps} onKeyDown={handleKeyDown} />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            onClear?.();
          }}
        >
          <XIcon className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
