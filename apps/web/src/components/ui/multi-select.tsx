"use client";

import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

type MultiSelectProps = {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  badgeClassName?: string;
  dir?: "rtl" | "ltr";
  disabled?: boolean;
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
  badgeClassName,
  dir,
  disabled = false,
  id,
  name,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
  const optionsRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const listboxId = React.useId();

  const handleUnselect = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  // Reset focused index when opening/closing dropdown
  React.useEffect(() => {
    setFocusedIndex(-1);
  }, [open]);

  // Add click outside handler
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    // Toggle dropdown with Space or Enter
    if ((e.key === " " || e.key === "Enter") && !open) {
      e.preventDefault();
      setOpen(true);
      return;
    }

    // Close with Escape
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (!open) return;

    const nonDisabledOptions = options.filter((opt) => !opt.disabled);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < nonDisabledOptions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : nonDisabledOptions.length - 1,
        );
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < nonDisabledOptions.length) {
          handleSelect(nonDisabledOptions[focusedIndex].value);
        }
        break;
      case "Home":
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setFocusedIndex(nonDisabledOptions.length - 1);
        break;
    }
  };

  // Scroll focused option into view
  React.useEffect(() => {
    if (focusedIndex >= 0 && optionsRef.current[focusedIndex]) {
      optionsRef.current[focusedIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [focusedIndex]);

  const selectedLabels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label);

  // Filter out disabled options for keyboard navigation
  const navigableOptions = options.filter((opt) => !opt.disabled);

  return (
    <div
      className="relative"
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-owns={listboxId}
      aria-controls={listboxId}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      id={id}
      dir={dir}
    >
      <div
        className={cn(
          "border-input ring-offset-background focus-within:ring-ring flex h-auto min-h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm text-black focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50",
          dir === "rtl" && "text-right",
          className,
        )}
        onClick={() => !disabled && setOpen(!open)}
      >
        <div className="flex flex-wrap gap-1">
          {selected.length === 0 && (
            <span className="text-gray-500">{placeholder}</span>
          )}
          {selected.length > 0 &&
            selectedLabels.map((label) => {
              const value = options.find(
                (option) => option.label === label,
              )?.value;
              return (
                <Badge
                  key={value}
                  variant="secondary"
                  className={cn(
                    "flex items-center gap-1 px-2 py-0.5",
                    badgeClassName,
                  )}
                >
                  {label}
                  <button
                    type="button"
                    className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (value) handleUnselect(value);
                    }}
                    disabled={disabled}
                    aria-label={`Remove ${label}`}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {label}</span>
                  </button>
                </Badge>
              );
            })}
        </div>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </div>
      {open && !disabled && (
        <div
          className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg"
          role="listbox"
          id={listboxId}
          aria-multiselectable="true"
        >
          <div className="max-h-60 overflow-y-auto p-1">
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              const isFocused =
                navigableOptions.findIndex((o) => o.value === option.value) ===
                focusedIndex;

              return (
                <div
                  key={option.value}
                  ref={(el) => {
                    if (!option.disabled) {
                      optionsRef.current[
                        navigableOptions.findIndex(
                          (o) => o.value === option.value,
                        )
                      ] = el;
                    }
                  }}
                  className={cn(
                    "relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm text-black outline-none select-none hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    isSelected && "bg-gray-100",
                    isFocused && "bg-gray-200",
                    dir === "rtl" && "pr-8 pl-2 text-right",
                    option.disabled && "cursor-not-allowed opacity-50",
                  )}
                  onClick={() => {
                    if (!option.disabled) {
                      handleSelect(option.value);
                    }
                  }}
                  data-disabled={option.disabled}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                >
                  <span
                    className={cn(
                      "absolute flex h-3.5 w-3.5 items-center justify-center",
                      dir === "rtl" ? "right-2" : "left-2",
                    )}
                  >
                    {isSelected && <Check className="h-4 w-4" />}
                  </span>
                  {option.label}
                </div>
              );
            })}
            {options.length === 0 && (
              <div className="py-6 text-center text-sm text-gray-500">
                No options available
              </div>
            )}
          </div>
        </div>
      )}
      {name && <input type="hidden" name={name} value={selected.join(",")} />}
    </div>
  );
}
