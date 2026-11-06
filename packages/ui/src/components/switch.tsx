"use client"

import { cn } from "@lw/ui/lib/utils"
import { Switch as SwitchPrimitive } from "radix-ui"
import * as React from "react"

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-8 shrink-0 items-center rounded-full border border-transparent outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-checked:bg-black data-unchecked:bg-input data-[state=checked]:bg-black data-[state=unchecked]:bg-input dark:data-checked:bg-white dark:data-[state=checked]:bg-white",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-4 rounded-full bg-white transition-transform data-checked:translate-x-3 data-unchecked:translate-x-0.5 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0.5 dark:bg-black"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
