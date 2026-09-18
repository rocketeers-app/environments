import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn("spinner text-muted-foreground", className)}
      {...props}
    />
  )
}

export { Spinner }
