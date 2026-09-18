import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { useScrollActiveIntoView } from "@/hooks/use-scroll-active-into-view"
import { cn } from "@/lib/utils"

type TabsCount = number | string | null | undefined

const ACTIVE_TRIGGER = '[data-slot="tabs-trigger"][data-state="active"]'

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & {
  orientation?: "horizontal" | "vertical"
}) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      orientation={orientation}
      className={cn(
        "flex",
        orientation === "vertical" ? "flex-row gap-2" : "flex-col gap-4",
        className
      )}
      {...props}
    />
  )
}

// A list wide enough to scroll keeps its active trigger inside the scroll viewport, so a tab
// strip too wide for a phone never opens parked on a tab the user cannot see. It centres with
// `safe`, because centred overflow spills past the start edge where scrolling cannot reach it.
function TabsList({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const scrollRef = useScrollActiveIntoView<HTMLDivElement>(ACTIVE_TRIGGER)

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      ref={(node) => {
        scrollRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      className={cn(
        "bg-tab-strip text-muted-foreground inline-flex h-12 w-fit items-center justify-center-safe rounded-xl p-1.5",
        className
      )}
      {...props}
    />
  )
}

function TabsCountLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tabs-count"
      className={cn(
        "bg-muted-foreground/15 text-muted-foreground inline-flex min-w-4 items-center justify-center rounded px-1 py-0.5 text-[11px] leading-none font-medium tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function TabsLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tabs-label"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

function TabsDivider({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tabs-divider"
      aria-hidden
      className={cn("bg-muted-foreground/35 mx-2 h-4 w-px shrink-0 self-center", className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  count,
  countClassName,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & { count?: TabsCount, countClassName?: string }) {
  const label = count === undefined || count === null || count === "" ? null : (
    <TabsCountLabel className={countClassName}>{count}</TabsCountLabel>
  )

  // The pill wears the outline button's surface; absolute! beats the position the bevel utility sets.
  const indicator = (
    <span
      data-slot="tabs-indicator"
      aria-hidden
      className="bevel border-input bg-background pointer-events-none absolute! -inset-px -z-10 hidden rounded-lg border group-data-[state=active]/tab:block"
    />
  )

  const child = children as React.ReactElement<{ children?: React.ReactNode }>
  const content = props.asChild && React.isValidElement(child)
    ? React.cloneElement(child, undefined, <>{indicator}<TabsLabel>{child.props.children}{label}</TabsLabel></>)
    : <>{indicator}<TabsLabel>{children}{label}</TabsLabel></>

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "group/tab bevel-light dark:bevel-dark data-[state=active]:[text-shadow:0_1px_0_var(--bevel-text)] dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground dark:text-muted-foreground relative isolate inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-transparent px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {content}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsCountLabel, TabsDivider, TabsContent }
export type { TabsCount }
