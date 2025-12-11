import { queriesStore } from "~/data/store/queries-store"

export function getQueries() {
  return queriesStore.getQueries()
}