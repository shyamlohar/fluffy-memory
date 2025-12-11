export type QueryType = Array<{ id: number; name: string; value: string }>;

class QueriesStore {
  private querirs: QueryType = [
    { id: 1, name: "Orders", value: "SELECT * from orders" },
  ];

  addQuery() {}

  getQueries() {
    return this.querirs;
  }

  getQueryById(id: number) {
    return this.querirs.find((query) => query.id === id);
  }

  removeQuery() {}
}

export const queriesStore = new QueriesStore()
