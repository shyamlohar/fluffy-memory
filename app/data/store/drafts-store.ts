const memoryDrafts = new Map<string, string>()

export const draftsStore = {
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

