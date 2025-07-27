"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxOption {
  value: string;
  label: string;
  category?: string;
  disabled?: boolean;
  description?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  groupByCategory?: boolean;
  clearable?: boolean;
  maxHeight?: number;
  loading?: boolean;
  error?: string;
  multiple?: boolean;
  values?: string[];
  onValuesChange?: (values: string[]) => void;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search options...",
  emptyText = "No options found.",
  className,
  disabled = false,
  groupByCategory = false,
  clearable = false,
  maxHeight = 300,
  loading = false,
  error,
  multiple = false,
  values = [],
  onValuesChange,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = React.useMemo(() => {
    if (multiple) {
      return options.filter((option) => values.includes(option.value));
    }
    return options.find((option) => option.value === value);
  }, [options, value, values, multiple]);

  const { filteredOptions, groupedOptions } = React.useMemo(() => {
    const filtered = options.filter((option) => {
      if (!searchValue) return true;
      const searchLower = searchValue.toLowerCase();
      return (
        option.label.toLowerCase().includes(searchLower) ||
        option.value.toLowerCase().includes(searchLower) ||
        option.description?.toLowerCase().includes(searchLower) ||
        option.category?.toLowerCase().includes(searchLower)
      );
    });

    const grouped = groupByCategory
      ? filtered.reduce(
          (groups, option) => {
            const category = option.category || "Other";
            if (!groups[category]) {
              groups[category] = [];
            }
            groups[category].push(option);
            return groups;
          },
          {} as Record<string, ComboboxOption[]>,
        )
      : { "": filtered };

    return { filteredOptions: filtered, groupedOptions: grouped };
  }, [options, searchValue, groupByCategory]);

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      if (multiple) {
        const newValues = values.includes(selectedValue)
          ? values.filter((v) => v !== selectedValue)
          : [...values, selectedValue];
        onValuesChange?.(newValues);
      } else {
        const newValue = selectedValue === value ? "" : selectedValue;
        onValueChange?.(newValue);
        setOpen(false);
      }
    },
    [multiple, values, value, onValueChange, onValuesChange],
  );

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (multiple) {
        onValuesChange?.([]);
      } else {
        onValueChange?.("");
      }
    },
    [multiple, onValueChange, onValuesChange],
  );

  React.useEffect(() => {
    if (!open) {
      setSearchValue("");
    }
  }, [open]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
    }
  }, []);

  const displayText = React.useMemo(() => {
    if (multiple) {
      if (values.length === 0) return placeholder;
      if (values.length === 1) {
        const option = options.find((opt) => opt.value === values[0]);
        return option?.label || values[0];
      }
      return `${values.length} selected`;
    }
    return selectedOption
      ? (selectedOption as ComboboxOption).label
      : placeholder;
  }, [multiple, values, selectedOption, placeholder, options]);

  const showClear =
    clearable && ((multiple && values.length > 0) || (!multiple && value));

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            className={cn(
              "w-full justify-between text-left font-normal",
              !value && !values.length && "text-muted-foreground",
              error && "border-destructive",
              className,
            )}
            disabled={disabled || loading}
          >
            <span className="truncate">{displayText}</span>
            <div className="flex items-center gap-1">
              {showClear && (
                <X
                  className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                  onClick={handleClear}
                />
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          ref={contentRef}
          className="w-full p-0"
          align="start"
          onKeyDown={handleKeyDown}
          style={{ width: triggerRef.current?.offsetWidth }}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList
              className="overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              style={{
                maxHeight: `${maxHeight}px`,
                overscrollBehavior: "contain",
              }}
            >
              {loading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : filteredOptions.length === 0 ? (
                <CommandEmpty>{emptyText}</CommandEmpty>
              ) : (
                Object.entries(groupedOptions).map(
                  ([category, categoryOptions]) => (
                    <CommandGroup
                      key={category}
                      heading={
                        groupByCategory && category ? category : undefined
                      }
                    >
                      {categoryOptions.map((option) => {
                        const isSelected = multiple
                          ? values.includes(option.value)
                          : value === option.value;

                        return (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                            onSelect={() => handleSelect(option.value)}
                            className={cn(
                              "cursor-pointer",
                              option.disabled &&
                                "opacity-50 cursor-not-allowed",
                              isSelected && "bg-accent",
                            )}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 shrink-0",
                                isSelected ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="truncate">{option.label}</div>
                              {option.description && (
                                <div className="text-xs text-muted-foreground truncate">
                                  {option.description}
                                </div>
                              )}
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  ),
                )
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
