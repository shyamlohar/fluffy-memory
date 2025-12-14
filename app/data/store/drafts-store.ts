import { storageService } from "~/lib/storage-service"

const STORAGE_KEY = "qr:drafts"

class DraftsStore {
  private drafts = new Map<string, string>()

  constructor() {
    this.hydrate()
  }

  private hydrate() {
    const parsed = storageService.get<Record<string, string>>(STORAGE_KEY)
    if (parsed && typeof parsed === "object") {
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === "string") {
          this.drafts.set(key, value)
        }
      }
    }
  }

  private persist() {
    storageService.set(STORAGE_KEY, Object.fromEntries(this.drafts))
  }

  get(tabKey: string) {
    return this.drafts.get(tabKey) ?? ""
  }

  set(tabKey: string, value: string) {
    this.drafts.set(tabKey, value)
    this.persist()
  }

  clear(tabKey: string) {
    this.drafts.delete(tabKey)
    this.persist()
  }
}

export const draftsStore = new DraftsStore()



