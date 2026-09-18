import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        success:
          "border-transparent bg-emerald-500 text-white [a&]:hover:bg-emerald-500/90 focus-visible:ring-emerald-500/20 dark:focus-visible:ring-emerald-500/40 dark:bg-emerald-500/60",
        warning:
          "border-transparent bg-amber-500 text-white [a&]:hover:bg-amber-500/90 focus-visible:ring-amber-500/20 dark:focus-visible:ring-amber-500/40 dark:bg-amber-500/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        "soft-gray":
          "border-gray-100/70 bg-gray-50/70 text-gray-700 dark:border-gray-400/10 dark:bg-gray-400/5 dark:text-gray-300",
        "soft-blue":
          "border-blue-100/70 bg-blue-50/70 text-blue-900 dark:border-blue-400/10 dark:bg-blue-400/5 dark:text-blue-200",
        "soft-green":
          "border-emerald-100/70 bg-emerald-50/70 text-emerald-900 dark:border-emerald-400/10 dark:bg-emerald-400/5 dark:text-emerald-200",
        "soft-orange":
          "border-orange-100/70 bg-orange-50/70 text-orange-900 dark:border-orange-400/10 dark:bg-orange-400/5 dark:text-orange-200",
        "soft-red":
          "border-red-100/70 bg-red-50/70 text-red-900 dark:border-red-400/10 dark:bg-red-400/5 dark:text-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

export { Badge, badgeVariants }
export type { BadgeVariant }
