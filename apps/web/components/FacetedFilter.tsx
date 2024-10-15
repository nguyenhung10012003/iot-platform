import { Icons } from '@repo/ui/components/icons/icons';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@repo/ui/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover';
import { Separator } from '@repo/ui/components/ui/separator';
import { cn } from '@repo/ui/lib/utils';

type FacetedFilterProps = {
  title: string;
  options: { label: string; value: string; icon?: React.ElementType }[];
  selectedValues: string[];
  onSelect: (values: string[] | undefined) => void;
};

export default function FacetedFilter({
  title,
  options,
  selectedValues,
  onSelect,
}: FacetedFilterProps) {
  const selections = new Set(selectedValues);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 border">
          <Icons.plus className="mr-2 h-4 w-4" />
          {title}
          {selections?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selections.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selections.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selections.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selections.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.label}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selections.has(option.value);
                return (
                  <CommandItem
                    key={option.label}
                    onSelect={() => {
                      if (isSelected) {
                        selections.delete(option.value);
                      } else {
                        selections.add(option.value);
                      }
                      onSelect(Array.from(selections));
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <Icons.check className={'h-4 w-4'} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selections.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onSelect(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
