"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value {...props} />;
}

function SelectTrigger({
  className,
  children,
  dir,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  dir?: "rtl" | "ltr";
}) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "border-input ring-offset-background focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm text-black placeholder:text-gray-500 hover:border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        dir === "rtl" && "text-right",
        className,
      )}
      dir={dir}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  dir,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  dir?: "rtl" | "ltr";
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-black shadow-lg",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          dir === "rtl" && "text-right",
          className,
        )}
        position={position}
        dir={dir}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  dir,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label> & {
  dir?: "rtl" | "ltr";
}) {
  return (
    <SelectPrimitive.Label
      className={cn(
        "py-1.5 text-sm font-semibold",
        dir === "rtl" ? "pr-8 pl-2" : "pr-2 pl-8",
        className,
      )}
      dir={dir}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  dir,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item> & {
  dir?: "rtl" | "ltr";
}) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 text-sm text-black outline-none select-none hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        dir === "rtl" ? "pr-8 pl-2" : "pr-2 pl-8",
        dir === "rtl" && "text-right",
        className,
      )}
      dir={dir}
      {...props}
    >
      <span
        className={cn(
          "absolute flex h-3.5 w-3.5 items-center justify-center",
          dir === "rtl" ? "right-2" : "left-2",
        )}
      >
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn("bg-muted -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(
        "flex cursor-default items-center justify-center py-1 hover:bg-gray-100",
        className,
      )}
      {...props}
    >
      <ChevronUp className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(
        "flex cursor-default items-center justify-center py-1 hover:bg-gray-100",
        className,
      )}
      {...props}
    >
      <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
