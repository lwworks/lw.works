"use client"

import { Checkbox as CheckboxPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@lw/ui/lib/utils"
import { Check as CheckIcon, Minus as MinusIcon } from "@mynaui/icons-react"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group/checkbox peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-black dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-black data-checked:bg-black data-checked:text-white dark:data-checked:bg-white dark:data-checked:border-white dark:data-checked:text-black data-[state=indeterminate]:border-black data-[state=indeterminate]:bg-black data-[state=indeterminate]:text-white dark:data-[state=indeterminate]:border-white dark:data-[state=indeterminate]:bg-white dark:data-[state=indeterminate]:text-black",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon strokeWidth={2} className="group-data-[state=indeterminate]/checkbox:hidden" />
        <MinusIcon strokeWidth={2} className="hidden group-data-[state=indeterminate]/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
