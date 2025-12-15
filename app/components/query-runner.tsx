import { PlayIcon, Save, Pause } from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
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
import { resultsStore } from "~/data/store/results-store"
import { runnerCommandsStore } from "~/data/store/runner-commands"
import { cn } from "~/lib/utils"

type QueryRunnerProps = {
  children: ReactNode
  initialValue?: string
  onRun?: (sql: string, signal?: AbortSignal) => Promise<QueryResult>
  onSave?: (sql: string) => Promise<void> | void
  onChangeValue?: (sql: string) => void
  savingState?: boolean
  tabKey?: string
  getAbortController?: () => AbortController
  className?: string
}

type QueryRunnerContextValue = {
  value: string
  setValue: (v: string) => void
  result: QueryResult | null
  error: string | null
  isRunning: boolean
  isSaving: boolean
  durationMs: number | null
  run: () => Promise<void>
  retry: () => Promise<void>
  cancel: () => void
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

function QueryRunner({
  children,
  initialValue = "",
  onRun = mockRunQuery,
  onSave,
  onChangeValue,
  savingState,
  tabKey,
  getAbortController,
  className,
}: QueryRunnerProps) {
  const [value, setValue] = useState(initialValue)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSavingInternal, setIsSavingInternal] = useState(false)
  const [durationMs, setDurationMs] = useState<number | null>(null)
  const runTokenRef = useRef<number | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const isSaving = savingState ?? isSavingInternal

  useEffect(() => {
    setValue(initialValue)
    setResult(null)
    setError(null)
  }, [initialValue])

  useEffect(() => {
    if (tabKey) {
      const stored = resultsStore.get(tabKey)
      if (stored) {
        setResult(stored.result)
        setDurationMs(stored.durationMs ?? null)
        return
      }
    }
    // If no stored data for this tab, clear last state so we don't show stale info.
    setResult(null)
    setDurationMs(null)
    setError(null)
  }, [tabKey])

  const run = useCallback(async () => {
    if (!value.trim()) return
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller
    if (getAbortController) getAbortController()
    setIsRunning(true)
    setDurationMs(null)
    const start = performance.now()
    const token = Date.now()
    runTokenRef.current = token
    try {
      const next = await onRun(value, controller.signal)
      if (runTokenRef.current !== token) return
      const elapsed = performance.now() - start
      setResult(next)
      setDurationMs(elapsed)
      if (tabKey) {
        resultsStore.set(tabKey, { result: next, durationMs: elapsed })
      }
      setError(null)
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return
      }
      if (runTokenRef.current !== token) return
      setError(err instanceof Error ? err.message : "Failed to run query")
      setResult(null)
      if (tabKey) {
        resultsStore.set(tabKey, null)
      }
    } finally {
      if (runTokenRef.current === token) {
        setIsRunning(false)
        runTokenRef.current = null
        abortControllerRef.current = null
      }
    }
  }, [onRun, value, tabKey, getAbortController])

  const cancel = useCallback(() => {
    runTokenRef.current = null
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    setIsRunning(false)
  }, [])

  const retry = useCallback(async () => {
    setError(null)
    await run()
  }, [run])

  const save = useCallback(async () => {
    if (!onSave) return
    if (savingState === undefined) {
      setIsSavingInternal(true)
    }
    try {
      await onSave(value)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save query")
    } finally {
      if (savingState === undefined) {
        setIsSavingInternal(false)
      }
    }
  }, [onSave, value, savingState])

  useEffect(() => {
    if (onChangeValue) {
      onChangeValue(value)
    }
  }, [value, onChangeValue])

  useEffect(() => {
    runnerCommandsStore.set({ run, save, cancel })
    return () => {
      runnerCommandsStore.set(null)
    }
  }, [run, save, cancel])

  const ctxValue = useMemo<QueryRunnerContextValue>(
    () => ({
      value,
      setValue,
      result,
      error,
      isRunning,
      isSaving,
      durationMs,
      run,
      retry,
      cancel,
      save,
      hasSave: Boolean(onSave),
    }),
    [value, result, error, isRunning, isSaving, durationMs, run, retry, cancel, save, onSave]
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
  const { run, cancel, isRunning, value } = useQueryRunnerContext()
  const hasQuery = value.trim().length > 0
  return (
    <Button
      onClick={isRunning ? cancel : run}
      variant={isRunning ? "destructive" : props.variant}
      disabled={props.disabled ?? !hasQuery}
      {...props}
    >
      {isRunning ? <Pause /> : <PlayIcon />}
      {children ?? (isRunning ? "Cancel" : "Run")}
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
  const { error, retry, isRunning } = useQueryRunnerContext()
  if (!error) return null
  return (
    <div
      className={cn(
        "min-h-48 flex flex-col items-center justify-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 text-sm text-destructive",
        className
      )}
    >
      <div>{error}</div>
      <Button variant="outline" size="sm" onClick={retry} disabled={isRunning}>
        Retry
      </Button>
    </div>
  )
}

function QueryRunnerResults() {
  const { result } = useQueryRunnerContext()
  if (!result) return null
  return <ResultTable columns={result.columns} rows={result.rows} />
}

function QueryRunnerOutput() {
  const { error, result } = useQueryRunnerContext()
  if (error) {
    return <QueryRunnerError />
  }
  if (result) {
    return <QueryRunnerResults />
  }
  return null
}

function QueryRunnerDuration({ className }: { className?: string }) {
  const { durationMs, isRunning } = useQueryRunnerContext()
  if (durationMs == null || isRunning) return null
  return (
    <div className={cn("text-xs text-muted-foreground", className)}>
      Last run: {durationMs.toFixed(1)} ms
    </div>
  )
}

type QueryRunnerComponent = FC<QueryRunnerProps> & {
  Input: typeof QueryRunnerInput
  Actions: typeof QueryRunnerActions
  RunButton: typeof QueryRunnerRunButton
  SaveButton: typeof QueryRunnerSaveButton
  Error: typeof QueryRunnerError
  Results: typeof QueryRunnerResults
  Output: typeof QueryRunnerOutput
  Duration: typeof QueryRunnerDuration
}

const QueryRunnerCompound = QueryRunner as QueryRunnerComponent
QueryRunnerCompound.Input = QueryRunnerInput
QueryRunnerCompound.Actions = QueryRunnerActions
QueryRunnerCompound.RunButton = QueryRunnerRunButton
QueryRunnerCompound.SaveButton = QueryRunnerSaveButton
QueryRunnerCompound.Error = QueryRunnerError
QueryRunnerCompound.Results = QueryRunnerResults
QueryRunnerCompound.Output = QueryRunnerOutput
QueryRunnerCompound.Duration = QueryRunnerDuration

export { QueryRunnerCompound as QueryRunner }

