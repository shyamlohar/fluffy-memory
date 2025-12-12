import { X, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useMemo } from "react";
import { useTabs } from "~/components/tabs-context";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { QueryType } from "~/data/store/queries-store";

export function TabsBar({ queries }: { queries: QueryType }) {
  const { tabs, activePath, closeTab } = useTabs();
  const navigate = useNavigate();

  const displayTabs = useMemo(() => {
    const titleMap = new Map(queries.map((q) => [q.id, q.name]));
    return tabs.map((tab) => {
      if (tab.type === "query") {
        const title = titleMap.get(tab.id) ?? tab.title ?? `Query ${tab.id}`;
        return { ...tab, title };
      }
      return tab;
    });
  }, [tabs, queries]);

  return (
    <div className="flex items-center gap-2">
      {displayTabs.length > 0 && (
        <div className="flex items-center gap-1 overflow-x-auto">
          {displayTabs.map((tab) => {
            const isActive = tab.path === activePath;
            return (
              <div
                key={tab.path}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-3 py-1 text-sm",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "bg-background"
                )}
              >
                <Link to={tab.path} className="truncate max-w-[180px]">
                  {tab.title}
                </Link>
                <button
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => closeTab(tab.path)}
                  aria-label={`Close ${tab.title}`}
                >
                  <X className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      <button
        title="New query"
        type="button"
        onClick={() => navigate(`/query/new?tab=${Date.now()}`)}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "gap-2"
        )}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
