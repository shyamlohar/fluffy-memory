const memoryDrafts = new Map<string, string>()

export const draftsStore = {
  init() {
    // no-op for now; hook up storage later if needed
  },
  get(tabKey: string) {
    return memoryDrafts.get(tabKey) ?? ""
  },
  set(tabKey: string, value: string) {
    memoryDrafts.set(tabKey, value)
  },
  clear(tabKey: string) {
    memoryDrafts.delete(tabKey)
  },
}

