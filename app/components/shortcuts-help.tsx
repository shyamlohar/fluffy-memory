import { useState } from "react"
import { HelpCircle, X } from "lucide-react"

type Shortcut = {
  keys: string
  action: string
}

const shortcuts: Shortcut[] = [
  { keys: "Cmd/Ctrl + Shift + N", action: "New query tab" },
  { keys: "Cmd/Ctrl + Shift + R", action: "Run query" },
  { keys: "Cmd/Ctrl + Shift + S", action: "Save query" },
  { keys: "Cmd/Ctrl + Shift + W", action: "Close active tab" },
  { keys: "Esc", action: "Cancel running query" },
]

export function ShortcutsHelp() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-sm shadow-lg transition hover:bg-accent"
        aria-label="Show keyboard shortcuts"
      >
        <HelpCircle className="size-4" />
        Shortcuts
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-base font-semibold">Keyboard shortcuts</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 hover:bg-muted"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="text-left font-medium pb-2">Keys</th>
                    <th className="text-left font-medium pb-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {shortcuts.map((shortcut) => (
                    <tr key={shortcut.keys}>
                      <td className="py-2 align-top font-mono text-xs">{shortcut.keys}</td>
                      <td className="py-2 align-top">{shortcut.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

