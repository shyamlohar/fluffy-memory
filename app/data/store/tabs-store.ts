import { storageService } from "~/lib/storage-service"

export type StoredTab =
  | { type: "new"; title: string; path: string }
  | { type: "query"; id: number; title: string; path: string }

const STORAGE_KEY_TABS = "qr:tabs"
const STORAGE_KEY_ACTIVE = "qr:tabs-active"

class TabsStore {
  private tabs: StoredTab[] = []
  private active: string | null = null

  constructor() {
    this.hydrate()
  }

  private hydrate() {
    const rawTabs = storageService.get<StoredTab[]>(STORAGE_KEY_TABS)
    const rawActive = storageService.get<string | null>(STORAGE_KEY_ACTIVE)

    if (typeof rawActive === "string") {
      this.active = rawActive
    }

    if (Array.isArray(rawTabs)) {
      this.tabs = rawTabs
        .map((t) => {
          if (!t || typeof t !== "object") return null
          if (t.type === "new" && typeof t.path === "string") {
            return { type: "new", title: t.title ?? "New query", path: t.path }
          }
          if (t.type === "query" && typeof t.id === "number" && typeof t.path === "string") {
            return { type: "query", id: t.id, title: t.title ?? `Query ${t.id}`, path: t.path }
          }
          return null
        })
        .filter(Boolean) as StoredTab[]
    }

    const seen = new Set<string>()
    this.tabs = this.tabs.filter((t) => {
      if (seen.has(t.path)) return false
      seen.add(t.path)
      return true
    })

    if (this.active && !this.tabs.find((t) => t.path === this.active)) {
      this.active = null
    }
  }

  private persistTabs() {
    storageService.set(STORAGE_KEY_TABS, this.tabs)
  }

  private persistActive() {
    if (this.active) {
      storageService.set(STORAGE_KEY_ACTIVE, this.active)
    } else {
      storageService.remove(STORAGE_KEY_ACTIVE)
    }
  }

  loadWithQueries(queries: Array<{ id: number; name: string }>) {
    const tabs = this.tabs
      .map((t) => {
        if (t.type === "new") return t
        const found = queries.find((q) => q.id === t.id)
        if (!found) return null
        return { ...t, title: found.name }
      })
      .filter(Boolean) as StoredTab[]

    let active = this.active
    if (active && !tabs.find((t) => t.path === active)) {
      active = null
    }

    return { tabs, active }
  }

  saveTabs(tabs: StoredTab[]) {
    this.tabs = tabs
    this.persistTabs()
  }

  saveActive(active: string | null) {
    this.active = active
    this.persistActive()
  }
}

export const tabsStore = new TabsStore()

