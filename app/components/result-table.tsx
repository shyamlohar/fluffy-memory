import { useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import type { VirtualItem } from "@tanstack/react-virtual"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

type ResultTableProps = {
  columns: string[]
  rows: Record<string, unknown>[]
}

export function ResultTable({ columns, rows }: ResultTableProps) {
  if (!columns.length) {
    return <div className="text-sm text-muted-foreground mt-3">No results to display</div>
  }

  const parentRef = useRef<HTMLDivElement | null>(null)
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 8,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0
  const paddingBottom =
    virtualRows.length > 0 ? totalSize - virtualRows[virtualRows.length - 1].end : 0

  return (
    <div className="mt-3 rounded-md border">
      <div ref={parentRef} className="max-h-[550px] overflow-auto">
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10 bg-muted/40">
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col} className="text-muted-foreground">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paddingTop > 0 && (
              <TableRow style={{ height: paddingTop }}>
                <TableCell colSpan={columns.length} />
              </TableRow>
            )}
            {virtualRows.map((virtualRow: VirtualItem) => {
              const row = rows[virtualRow.index]
              return (
                <TableRow
                  key={virtualRow.key}
                  className="odd:bg-muted/10"
                  style={{
                    height: virtualRow.size,
                  }}
                  data-index={virtualRow.index}
                >
                  {columns.map((col) => (
                    <TableCell key={col}>{String(row[col] ?? "")}</TableCell>
                  ))}
                </TableRow>
              )
            })}
            {paddingBottom > 0 && (
              <TableRow style={{ height: paddingBottom }}>
                <TableCell colSpan={columns.length} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

