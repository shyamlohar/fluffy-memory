import { PlayIcon, Plus, Trash } from "lucide-react"
import * as React from "react"

import { Link, useMatch, useNavigate } from "react-router"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarMenuSub,
  // SidebarMenuSubButton,
  // SidebarMenuSubItem,
  SidebarRail,
} from "~/components/ui/sidebar"
import { Input } from "~/components/ui/input"
import { type QueryType, queriesStore } from "~/data/store/queries-store"
import { Button } from "./ui/button"
import { useTabs } from "./tabs-context"
import { resultsStore } from "~/data/store/results-store"

// // This is sample data.
// const data = {
//   navMain: [
//     {
//       title: "Getting Started",
//       url: "#",
//       items: [
//         {
//           title: "Installation",
//           url: "#",
//         },
//         {
//           title: "Project Structure",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Building Your Application",
//       url: "#",
//       items: [
//         {
//           title: "Routing",
//           url: "#",
//         },
//         {
//           title: "Data Fetching",
//           url: "#",
//           isActive: true,
//         },
//         {
//           title: "Rendering",
//           url: "#",
//         },
//         {
//           title: "Caching",
//           url: "#",
//         },
//         {
//           title: "Styling",
//           url: "#",
//         },
//         {
//           title: "Optimizing",
//           url: "#",
//         },
//         {
//           title: "Configuring",
//           url: "#",
//         },
//         {
//           title: "Testing",
//           url: "#",
//         },
//         {
//           title: "Authentication",
//           url: "#",
//         },
//         {
//           title: "Deploying",
//           url: "#",
//         },
//         {
//           title: "Upgrading",
//           url: "#",
//         },
//         {
//           title: "Examples",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "API Reference",
//       url: "#",
//       items: [
//         {
//           title: "Components",
//           url: "#",
//         },
//         {
//           title: "File Conventions",
//           url: "#",
//         },
//         {
//           title: "Functions",
//           url: "#",
//         },
//         {
//           title: "next.config.js Options",
//           url: "#",
//         },
//         {
//           title: "CLI",
//           url: "#",
//         },
//         {
//           title: "Edge Runtime",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Architecture",
//       url: "#",
//       items: [
//         {
//           title: "Accessibility",
//           url: "#",
//         },
//         {
//           title: "Fast Refresh",
//           url: "#",
//         },
//         {
//           title: "Next.js Compiler",
//           url: "#",
//         },
//         {
//           title: "Supported Browsers",
//           url: "#",
//         },
//         {
//           title: "Turbopack",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Community",
//       url: "#",
//       items: [
//         {
//           title: "Contribution Guide",
//           url: "#",
//         },
//       ],
//     },
//   ],
// }

export function AppSidebar({ queries, ...props }: React.ComponentProps<typeof Sidebar> & { queries: QueryType }) {
  const match = useMatch("/query/:id")
  const activeId = match?.params.id ? Number(match.params.id) : null
  const [search, setSearch] = React.useState("")
  const [localQueries, setLocalQueries] = React.useState(queries)
  const navigate = useNavigate()
  const { closeTab } = useTabs()

  React.useEffect(() => {
    setLocalQueries(queries)
  }, [queries])

  const filteredQueries = React.useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return localQueries
    return localQueries.filter((q) => q.name.toLowerCase().includes(term))
  }, [localQueries, search])

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("Delete this query?")
    if (!confirmed) return
    const removed = queriesStore.removeQuery(id)
    if (!removed) return
    setLocalQueries((prev) => prev.filter((q) => q.id !== id))
    const path = `/query/${id}`
    resultsStore.clear(path)
    closeTab(path)
    if (activeId === id) {
      navigate("/")
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <PlayIcon className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Query Runner</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pt-0">
          <div className="px-2 pb-2 flex items-center gap-2 sticky top-0 bg-sidebar z-10">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search queries"
              className="h-8"
            />
            <Button
              size="sm"
              className="px-2"
              onClick={() => navigate(`/query/new?tab=${Date.now()}`)}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          <SidebarMenu className="pt-2">
            {filteredQueries.map((query) => {
              const isActive = activeId === query.id
              return (
                <SidebarMenuItem key={query.id}>
                  <div className="flex items-center justify-between gap-2">
                    <SidebarMenuButton asChild isActive={isActive} className="flex-1">
                      <Link to={`/query/${query.id}`} className="font-medium">
                        {query.name}
                      </Link>
                    </SidebarMenuButton>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete query"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDelete(query.id)
                      }}
                    >
                      <Trash className="size-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
