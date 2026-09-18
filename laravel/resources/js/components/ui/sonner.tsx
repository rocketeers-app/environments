import { Spinner } from '@/components/ui/spinner';
import {
    CircleCheckIcon,
    InfoIcon,
    OctagonXIcon,
    TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

// Inertia modals open as native <dialog> via showModal(), which renders them in the browser
// top layer — above any z-index, so a normal toaster can never sit on top. We promote the
// toaster into the top layer with the Popover API and re-promote it on every dialog open
// (top-layer order is last-promoted-wins) so toasts always paint above the modal.
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el || !("showPopover" in el)) return

    const promote = () => {
      try {
        if (el.matches(":popover-open")) el.hidePopover()
        el.showPopover()
      } catch {
        void 0
      }
    }

    promote()

    const observer = new MutationObserver(promote)
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] })

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      popover="manual"
      style={{
        inset: "auto",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        margin: 0,
        padding: 0,
        border: 0,
        background: "transparent",
        overflow: "visible",
      }}
    >
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        icons={{
          success: <CircleCheckIcon className="size-4" />,
          info: <InfoIcon className="size-4" />,
          warning: <TriangleAlertIcon className="size-4" />,
          error: <OctagonXIcon className="size-4" />,
          loading: <Spinner className="size-4" />,
        }}
        style={
          {
            "--normal-bg": "var(--popover)",
            "--normal-text": "var(--popover-foreground)",
            "--normal-border": "var(--border)",
            "--border-radius": "var(--radius)",
          } as React.CSSProperties
        }
        {...props}
      />
    </div>
  )
}

export { Toaster }
