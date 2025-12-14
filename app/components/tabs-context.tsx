import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router"
import type { QueryType } from "~/data/store/queries-store"
import { resultsStore } from "~/data/store/results-store"

type Tab =
  | { type: "new"; title: string; path: string }
  | { type: "query"; id: number; title: string; path: string }

type TabsContextValue = {
  tabs: Tab[]
  activePath: string | null
  closeTab: (path: string) => void
  replaceTab: (oldPath: string, nextTab: Tab) => void
  newTab: () => void
  closeActive: () => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function tabFromLocation(pathname: string, search: string, queries: QueryType): Tab | null {
  const path = `${pathname}${search ?? ""}`

  if (pathname === "/query/new") {
    return { type: "new", title: "New query", path }
  }

  const queryMatch = pathname.match(/^\/query\/(\d+)/)
  if (queryMatch) {
    const id = Number(queryMatch[1])
    const found = queries.find((q) => q.id === id)
    if (!found) return null
    const title = found.name
    return { type: "query", id, title, path }
  }

  return null
}

export function TabsProvider({
  children,
  queries,
}: {
  children: React.ReactNode
  queries: QueryType
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams,] = useSearchParams();
  const tabKey = searchParams.get("tab");
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const initial = tabFromLocation(location.pathname, location.search, queries)
    return initial ? [initial] : []
  })
  const [activePath, setActivePath] = useState<string | null>(() => {
    const initial = tabFromLocation(location.pathname, location.search, queries)
    return initial?.path ?? null
  })

  

  const closeTab = useCallback(
    (path: string) => {
      setTabs((prev) => {
        const idx = prev.findIndex((t) => t.path === path)
        if (idx === -1) return prev

        const nextTabs = [...prev.slice(0, idx), ...prev.slice(idx + 1)]
        resultsStore.clear(path)

        if (activePath === path) {
          const fallback = nextTabs[idx - 1] ?? nextTabs[idx] ?? null
          const nextPath = fallback?.path ?? "/"
          setActivePath(fallback ? fallback.path : null)
          navigate(nextPath)
        }

        return nextTabs
      })
    },
    [activePath, navigate]
  )

  const replaceTab = useCallback(
    (oldPath: string, nextTab: Tab) => {
      setTabs((prev) => {
        const idx = prev.findIndex((t) => t.path === oldPath)
        if (idx === -1) {
          setActivePath(nextTab.path)
          return [...prev, nextTab]
        }
        const nextTabs = [...prev]
        nextTabs[idx] = nextTab
        setActivePath(nextTab.path)
        return nextTabs
      })
    },
    []
  )

  const newTab = useCallback(() => {
    const path = `/query/new?tab=${Date.now()}`
    navigate(path)
    setActivePath(path)
    setTabs((prev) => {
      if (prev.find((t) => t.path === path)) return prev
      return [...prev, { type: "new", title: "New query", path }]
    })
  }, [navigate])

  const closeActive = useCallback(() => {
    if (!activePath) return
    closeTab(activePath)
  }, [activePath, closeTab])

  // Sync with route changes: ensure current path is in tabs and active.
  useEffect(() => {
    const nextTab = tabFromLocation(location.pathname, location.search, queries)
    if (!nextTab) {
      setActivePath(null)
      return
    }
    setActivePath(nextTab.path)
    setTabs((prev) => {
      const exists = prev.find((t) => t.path === nextTab.path)
      if (exists) return prev
      return [...prev, nextTab]
    })
  }, [location.pathname, location.search, queries])

  const value = useMemo(
    () => ({
      tabs,
      activePath,
      closeTab,
      replaceTab,
      newTab,
      closeActive,
    }),
    [tabs, activePath, closeTab, replaceTab, newTab, closeActive]
  )

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>
}

export function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error("useTabs must be used within TabsProvider")
  return ctx
}

