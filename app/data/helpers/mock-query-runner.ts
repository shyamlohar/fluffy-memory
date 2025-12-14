export type QueryResult = {
  columns: string[]
  rows: Record<string, unknown>[]
}

async function loadCsvData(): Promise<QueryResult> {

  const { default: employeeCsvUrl } = await import("~/data/employee.csv?url")

  const response = await fetch(employeeCsvUrl)
  const text = await response.text()
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (lines.length === 0) {
    return { columns: [], rows: [] }
  }

  const columns = lines[0].split(",").map((col) => col.trim())
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim())
    return columns.reduce<Record<string, unknown>>((acc, col, idx) => {
      const raw = values[idx] ?? ""
      acc[col] = raw === "-" ? null : raw
      return acc
    }, {})
  })

  return { columns, rows }
}

export async function mockRunQuery(_sql: string, signal?: AbortSignal): Promise<QueryResult> {
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError")
  }

  const { columns, rows } = await loadCsvData()

  const max = Math.min(100, rows.length)
  const count = Math.max(200, Math.floor(Math.random() * max))
  const sample = rows.slice(0, count)

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, 5000)
    if (signal) {
      signal.addEventListener(
        "abort",
        () => {
          clearTimeout(timeout)
          reject(new DOMException("Aborted", "AbortError"))
        },
        { once: true }
      )
    }
  })

  return { columns, rows: sample }
}

