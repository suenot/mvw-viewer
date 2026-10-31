import * as SelectPrimitive from "@radix-ui/react-select";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "../lib";

// shadcn/ui-style wrappers over Radix primitives.
export function Select({ value, onValueChange, placeholder, options, className }) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        className={cn(
          "flex h-9 min-w-[10rem] items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-sm shadow-sm",
          "hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring data-[placeholder]:text-muted-foreground",
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon><ChevronDown className="h-4 w-4 opacity-60" /></SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper" sideOffset={4}
          className="z-50 max-h-80 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((o) => (
              <SelectPrimitive.Item
                key={o.value} value={o.value}
                className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
              >
                <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                  <SelectPrimitive.ItemIndicator><Check className="h-4 w-4" /></SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText>{o.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export function Checkbox({ checked, onCheckedChange, id }) {
  return (
    <CheckboxPrimitive.Root
      id={id} checked={checked} onCheckedChange={onCheckedChange}
      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary shadow focus:outline-none focus:ring-2 focus:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
    >
      <CheckboxPrimitive.Indicator><Check className="h-3 w-3" /></CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export const Dialog = DialogPrimitive.Root;
export function DialogContent({ children, title }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/70" />
      <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[min(1100px,95vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border bg-background p-5 shadow-lg focus:outline-none">
        <DialogPrimitive.Title className="pr-8 text-lg font-semibold">{title}</DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">Video details</DialogPrimitive.Description>
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring">
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export const Button = ({ className, ...p }) => (
  <button className={cn("inline-flex h-8 items-center rounded-md border border-input bg-background px-3 text-sm hover:bg-accent", className)} {...p} />
);
