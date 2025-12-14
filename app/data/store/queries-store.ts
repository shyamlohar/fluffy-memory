import { storageService } from "~/lib/storage-service"

export type QueryType = Array<{ id: number; name: string; value: string }>

const STORAGE_KEY = "qr:queries"

class QueriesStore {
  private queries: QueryType = [
    { id: 1, name: "Employees", value: "SELECT * from employees" },
    { id: 2, name: "Orders", value: "SELECT * from orders" },
    { id: 3, name: "Products", value: "SELECT * from products" },
  ]

  constructor() {
    this.hydrate()
  }

  private hydrate() {
    const parsed = storageService.get<QueryType>(STORAGE_KEY)
    if (parsed && Array.isArray(parsed)) {
      this.queries = parsed
    }
  }

  private persist() {
    storageService.set(STORAGE_KEY, this.queries)
  }

  getQueries() {
    return this.queries
  }

  getQueryById(id: number) {
    return this.queries.find((query) => query.id === id)
  }

  addQuery(name: string, value: string) {
    const nextId =
      this.queries.length > 0
        ? Math.max(...this.queries.map((q) => q.id)) + 1
        : 1
    const nextQuery = { id: nextId, name, value }
    this.queries.push(nextQuery)
    this.persist()
    return nextQuery
  }

  updateQuery(id: number, data: Partial<{ name: string; value: string }>) {
    const idx = this.queries.findIndex((q) => q.id === id)
    if (idx === -1) return null
    const existing = this.queries[idx]
    const updated = {
      ...existing,
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.value !== undefined ? { value: data.value } : {}),
    }
    this.queries[idx] = updated
    this.persist()
    return updated
  }

  removeQuery(id: number) {
    const before = this.queries.length
    this.queries = this.queries.filter((q) => q.id !== id)
    const removed = this.queries.length < before
    if (removed) this.persist()
    return removed
  }
}

export const queriesStore = new QueriesStore()
