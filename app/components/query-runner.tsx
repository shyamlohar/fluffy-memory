import { PlayIcon, Save } from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import type {
  ComponentProps,
  FC,
  HTMLAttributes,
  ReactNode,
} from "react"

import { Button } from "~/components/ui/button"
import { QueryInput } from "~/components/query-input"
import { ResultTable } from "~/components/result-table"
import { mockRunQuery, type QueryResult } from "~/data/helpers/mock-query-runner"
import { cn } from "~/lib/utils"

type QueryRunnerProps = {
  children: ReactNode
  initialValue?: string
  onRun?: (sql: string) => Promise<QueryResult>
  onSave?: (sql: string) => Promise<void> | void
  className?: string
}

type QueryRunnerContextValue = {
  value: string
  setValue: (v: string) => void
  result: QueryResult | null
  error: string | null
  isRunning: boolean
  isSaving: boolean
  run: () => Promise<void>
  save: () => Promise<void>
  hasSave: boolean
}

const QueryRunnerContext = createContext<QueryRunnerContextValue | null>(null)

function useQueryRunnerContext() {
  const ctx = useContext(QueryRunnerContext)
  if (!ctx) {
    throw new Error("QueryRunner components must be used within <QueryRunner>")
  }
  return ctx
}

function QueryRunner({ children, initialValue = "", onRun = mockRunQuery, onSave, className }: QueryRunnerProps) {
  const [value, setValue] = useState(initialValue)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const run = useCallback(async () => {
    if (!value.trim()) return
    setIsRunning(true)
    try {
      const next = await onRun(value)
      setResult(next)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run query")
    } finally {
      setIsRunning(false)
    }
  }, [onRun, value])

  const save = useCallback(async () => {
    if (!onSave) return
    setIsSaving(true)
    try {
      await onSave(value)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save query")
    } finally {
      setIsSaving(false)
    }
  }, [onSave, value])

  const ctxValue = useMemo<QueryRunnerContextValue>(
    () => ({
      value,
      setValue,
      result,
      error,
      isRunning,
      isSaving,
      run,
      save,
      hasSave: Boolean(onSave),
    }),
    [value, result, error, isRunning, isSaving, run, save, onSave]
  )

  return (
    <QueryRunnerContext.Provider value={ctxValue}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </QueryRunnerContext.Provider>
  )
}

function QueryRunnerInput(props: ComponentProps<typeof QueryInput>) {
  const { value, setValue, isRunning } = useQueryRunnerContext()
  const { disabled, ...rest } = props
  return (
    <QueryInput
      value={value}
      onChange={(event) => setValue(event.target.value)}
      disabled={disabled ?? isRunning}
      {...rest}
    />
  )
}

function QueryRunnerActions({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-start gap-2", className)} {...props} />
}

function QueryRunnerRunButton({ children, ...props }: ComponentProps<typeof Button>) {
  const { run, isRunning } = useQueryRunnerContext()
  return (
    <Button onClick={run} disabled={isRunning} {...props}>
      <PlayIcon />
      {children ?? (isRunning ? "Running..." : "Run")}
    </Button>
  )
}

function QueryRunnerSaveButton({ children, ...props }: ComponentProps<typeof Button>) {
  const { save, isSaving, hasSave } = useQueryRunnerContext()
  const disabled = props.disabled ?? (!hasSave || isSaving)
  return (
    <Button onClick={save} disabled={disabled} variant="outline" {...props}>
      <Save />
      {children ?? (isSaving ? "Saving..." : "Save")}
    </Button>
  )
}

function QueryRunnerError({ className }: { className?: string }) {
  const { error } = useQueryRunnerContext()
  if (!error) return null
  return <div className={cn("text-destructive text-sm", className)}>{error}</div>
}

function QueryRunnerResults() {
  const { result } = useQueryRunnerContext()
  if (!result) return null
  return <ResultTable columns={result.columns} rows={result.rows} />
}

type QueryRunnerComponent = FC<QueryRunnerProps> & {
  Input: typeof QueryRunnerInput
  Actions: typeof QueryRunnerActions
  RunButton: typeof QueryRunnerRunButton
  SaveButton: typeof QueryRunnerSaveButton
  Error: typeof QueryRunnerError
  Results: typeof QueryRunnerResults
}

const QueryRunnerCompound = QueryRunner as QueryRunnerComponent
QueryRunnerCompound.Input = QueryRunnerInput
QueryRunnerCompound.Actions = QueryRunnerActions
QueryRunnerCompound.RunButton = QueryRunnerRunButton
QueryRunnerCompound.SaveButton = QueryRunnerSaveButton
QueryRunnerCompound.Error = QueryRunnerError
QueryRunnerCompound.Results = QueryRunnerResults

export { QueryRunnerCompound as QueryRunner }

