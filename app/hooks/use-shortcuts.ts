import { useEffect } from "react"
import { useTabs } from "~/components/tabs-context"
import { runnerCommandsStore } from "~/data/store/runner-commands"

type ShortcutOptions = {
  enabled?: boolean
}

export function useShortcuts({ enabled = true }: ShortcutOptions = {}) {
  const { newTab, closeActive } = useTabs()

  useEffect(() => {
    if (!enabled) return

    const handler = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey
      const shift = event.shiftKey

      // Avoid when typing in inputs/textareas unless the combo is meant to act globally.
      const target = event.target as HTMLElement | null
      const isFormElement =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.getAttribute("contenteditable") === "true")

      if (isFormElement) return

      // Run (Cmd/Ctrl + Shift + R)
      if (meta && shift && event.key.toLowerCase() === "r") {
        event.preventDefault()
        const cmd = runnerCommandsStore.get()
        cmd?.run?.()
        return
      }

      // Save (Cmd/Ctrl + Shift + S)
      if (meta && shift && event.key.toLowerCase() === "s") {
        event.preventDefault()
        const cmd = runnerCommandsStore.get()
        cmd?.save?.()
        return
      }

      // New tab (Cmd/Ctrl + Shift + N)
      if (meta && shift && event.key.toLowerCase() === "n") {
        event.preventDefault()
        newTab()
        return
      }

      // Close tab (Cmd/Ctrl + Shift + W)
      if (meta && shift && event.key.toLowerCase() === "w") {
        event.preventDefault()
        closeActive()
        return
      }

      // Cancel (Esc)
      if (event.key === "Escape") {
        const cmd = runnerCommandsStore.get()
        if (cmd?.cancel) {
          event.preventDefault()
          cmd.cancel()
        }
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [enabled, newTab, closeActive])
}
