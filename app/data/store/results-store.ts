import type { QueryResult } from "~/data/helpers/mock-query-runner"

type StoredResult = {
  result: QueryResult
  durationMs: number | null
}

const memoryResults = new Map<string, StoredResult>()

export const resultsStore = {
  get(tabKey: string) {
    return memoryResults.get(tabKey) ?? null
  },
  set(tabKey: string, data: StoredResult | null) {
    if (data) {
      memoryResults.set(tabKey, data)
    } else {
      memoryResults.delete(tabKey)
    }
  },
  clear(tabKey: string) {
    memoryResults.delete(tabKey)
  },
}

