"use client"

import * as React from "react"
import { cn } from "cn"
import { Tabs as TabsPrimitive } from "radix-ui"

function Tabs(props: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />
}

function TabsList({
  className,
  variant = "underline",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { variant?: "underline" | "pill" }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        "group/tabs flex gap-1 overflow-x-auto data-[variant=underline]:gap-0 data-[variant=underline]:border-b data-[variant=underline]:border-border",
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 text-[0.8125rem] font-semibold whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset",
        "group-data-[variant=underline]/tabs:h-10 group-data-[variant=underline]/tabs:border-b-2 group-data-[variant=underline]/tabs:border-transparent group-data-[variant=underline]/tabs:px-3.5 group-data-[variant=underline]/tabs:text-text-secondary group-data-[variant=underline]/tabs:hover:text-foreground group-data-[variant=underline]/tabs:data-[state=active]:border-primary group-data-[variant=underline]/tabs:data-[state=active]:text-foreground",
        "group-data-[variant=pill]/tabs:h-8 group-data-[variant=pill]/tabs:rounded-full group-data-[variant=pill]/tabs:bg-muted group-data-[variant=pill]/tabs:px-3.5 group-data-[variant=pill]/tabs:hover:bg-selected group-data-[variant=pill]/tabs:data-[state=active]:bg-foreground group-data-[variant=pill]/tabs:data-[state=active]:text-background",
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("outline-none focus-visible:ring-3 focus-visible:ring-ring", className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
