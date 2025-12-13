export type QueryType = Array<{ id: number; name: string; value: string }>

class QueriesStore {
  private queries: QueryType = [
    { id: 1, name: "Employees", value: "SELECT * from employees" },
    { id: 2, name: "Orders", value: "SELECT * from orders" },
    { id: 3, name: "Products", value: "SELECT * from products" },
  ]

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
    return nextQuery
  }

  removeQuery(id: number) {
    const before = this.queries.length
    this.queries = this.queries.filter((q) => q.id !== id)
    return this.queries.length < before
  }
}

export const queriesStore = new QueriesStore()
