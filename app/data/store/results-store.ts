import type { QueryResult } from "~/data/helpers/mock-query-runner"
import { storageService } from "~/lib/storage-service"

type StoredResult = {
  result: QueryResult
  durationMs: number | null
}

const STORAGE_KEY = "qr:results"

class ResultsStore {
  private results = new Map<string, StoredResult>()

  constructor() {
    this.hydrate()
  }

  private hydrate() {
    const parsed = storageService.get<Record<string, StoredResult>>(STORAGE_KEY)
    if (parsed && typeof parsed === "object") {
      for (const [key, value] of Object.entries(parsed)) {
        if (value && typeof value === "object" && "result" in value) {
          this.results.set(key, value as StoredResult)
        }
      }
    }
  }

  private persist() {
    storageService.set(STORAGE_KEY, Object.fromEntries(this.results))
  }

  get(tabKey: string) {
    return this.results.get(tabKey) ?? null
  }

  set(tabKey: string, data: StoredResult | null) {
    if (data) {
      this.results.set(tabKey, data)
    } else {
      this.results.delete(tabKey)
    }
    this.persist()
  }

  clear(tabKey: string) {
    this.results.delete(tabKey)
    this.persist()
  }
}

export const resultsStore = new ResultsStore()

