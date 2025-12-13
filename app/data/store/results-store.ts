import type { QueryResult } from "~/data/helpers/mock-query-runner"

const memoryResults = new Map<string, QueryResult>()

export const resultsStore = {
  get(tabKey: string) {
    return memoryResults.get(tabKey) ?? null
  },
  set(tabKey: string, result: QueryResult | null) {
    if (result) {
      memoryResults.set(tabKey, result)
    } else {
      memoryResults.delete(tabKey)
    }
  },
  clear(tabKey: string) {
    memoryResults.delete(tabKey)
  },
}

