import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { router } from "@inertiajs/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium select-none transition-[color,box-shadow,translate] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 bevel bevel-dark dark:bevel-light",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 bevel bevel-dark",
        success:
          "bg-emerald-500 text-white hover:bg-emerald-500/90 focus-visible:ring-emerald-500/20 dark:focus-visible:ring-emerald-500/40 bevel bevel-success",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground bevel bevel-light dark:bevel-dark",
        cancel:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 bevel bevel-light dark:bevel-dark",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-lg px-6 has-[>svg]:px-4",
        icon: "h-9 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  onKeyDown,
  onKeyUp,
  onBlur,
  ref,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  const [keyPressed, setKeyPressed] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)

  const attachRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node

      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    },
    [ref]
  )

  React.useEffect(() => {
    const button = buttonRef.current

    if (!(button instanceof HTMLButtonElement) || button.type !== "submit" || !button.form) {
      return
    }

    const form = button.form
    const handleSubmit = (event: SubmitEvent) => {
      if (event.submitter === button) {
        setSubmitting(true)
      }
    }

    form.addEventListener("submit", handleSubmit)

    return () => form.removeEventListener("submit", handleSubmit)
  }, [])

  React.useEffect(() => {
    if (!submitting) {
      return
    }

    const stopListening = router.on("finish", () => setSubmitting(false))
    const timer = window.setTimeout(() => setSubmitting(false), 10000)

    return () => {
      stopListening()
      window.clearTimeout(timer)
    }
  }, [submitting])

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      setKeyPressed(true)
    }

    onKeyDown?.(event)
  }

  const handleKeyUp: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      setKeyPressed(false)
    }

    onKeyUp?.(event)
  }

  const handleBlur: React.FocusEventHandler<HTMLButtonElement> = (event) => {
    setKeyPressed(false)

    onBlur?.(event)
  }

  const showSpinner = loading || submitting

  return (
    <Comp
      data-slot="button"
      ref={attachRef}
      className={cn(buttonVariants({ variant, size, className }))}
      data-pressed={keyPressed ? "" : undefined}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
      disabled={disabled || loading}
      {...props}
    >
      {asChild ? children : <>{showSpinner && <Spinner className="text-current/45" />}{children}</>}
    </Comp>
  )
}

export { Button, buttonVariants }
