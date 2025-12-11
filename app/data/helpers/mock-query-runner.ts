export type QueryResult = {
  columns: string[]
  rows: Record<string, unknown>[]
}

const SAMPLE_ROWS: QueryResult["rows"] = [
  {
    EMPLOYEE_ID: 198,
    FIRST_NAME: "Donald",
    LAST_NAME: "OConnell",
    EMAIL: "DOCONNEL",
    DEPARTMENT_ID: 50,
    SALARY: 2600,
  },
  {
    EMPLOYEE_ID: 200,
    FIRST_NAME: "Jennifer",
    LAST_NAME: "Whalen",
    EMAIL: "JWHALEN",
    DEPARTMENT_ID: 10,
    SALARY: 4400,
  },
  {
    EMPLOYEE_ID: 201,
    FIRST_NAME: "Michael",
    LAST_NAME: "Hartstein",
    EMAIL: "MHARTSTE",
    DEPARTMENT_ID: 20,
    SALARY: 13000,
  },
  {
    EMPLOYEE_ID: 204,
    FIRST_NAME: "Hermann",
    LAST_NAME: "Baer",
    EMAIL: "HBAER",
    DEPARTMENT_ID: 70,
    SALARY: 10000,
  },
  {
    EMPLOYEE_ID: 208,
    FIRST_NAME: "Laura",
    LAST_NAME: "Bissot",
    EMAIL: "LBISSOT",
    DEPARTMENT_ID: 50,
    SALARY: 3300,
  },
  {
    EMPLOYEE_ID: 109,
    FIRST_NAME: "Daniel",
    LAST_NAME: "Faviet",
    EMAIL: "DFAVIET",
    DEPARTMENT_ID: 100,
    SALARY: 9000,
  },
  {
    EMPLOYEE_ID: 115,
    FIRST_NAME: "Alexander",
    LAST_NAME: "Khoo",
    EMAIL: "AKHOO",
    DEPARTMENT_ID: 30,
    SALARY: 3100,
  },
  {
    EMPLOYEE_ID: 103,
    FIRST_NAME: "Alexander",
    LAST_NAME: "Hunold",
    EMAIL: "AHUNOLD",
    DEPARTMENT_ID: 60,
    SALARY: 9000,
  },
  {
    EMPLOYEE_ID: 106,
    FIRST_NAME: "Valli",
    LAST_NAME: "Pataballa",
    EMAIL: "VPATABAL",
    DEPARTMENT_ID: 60,
    SALARY: 4800,
  },
  {
    EMPLOYEE_ID: 137,
    FIRST_NAME: "Renske",
    LAST_NAME: "Ladwig",
    EMAIL: "RLADWIG",
    DEPARTMENT_ID: 50,
    SALARY: 3600,
  },
]

export async function mockRunQuery(_sql: string): Promise<QueryResult> {
  // Shuffle rows and take a small sample to keep the table compact.
  const shuffled = [...SAMPLE_ROWS].sort(() => Math.random() - 0.5)
  const rows = shuffled.slice(0, 5)
  const columns = rows.length ? Object.keys(rows[0]) : []

  // Simulate async work to mirror a real query call.
  await new Promise((resolve) => setTimeout(resolve, 150))

  return { columns, rows }
}

