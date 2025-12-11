import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

type ResultTableProps = {
  columns: string[]
  rows: Record<string, unknown>[]
}

export function ResultTable({ columns, rows }: ResultTableProps) {
  if (!columns.length) {
    return <div className="text-sm text-muted-foreground mt-3">No results to display</div>
  }

  return (
    <div className="mt-3 rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            {columns.map((col) => (
              <TableHead key={col} className="text-muted-foreground">
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIdx) => (
            <TableRow key={rowIdx} className="odd:bg-muted/10">
              {columns.map((col) => (
                <TableCell key={col}>{String(row[col] ?? "")}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

