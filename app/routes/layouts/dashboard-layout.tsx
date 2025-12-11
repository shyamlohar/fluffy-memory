import { Outlet } from "react-router";
import { Separator } from "@radix-ui/react-separator";
import { AppSidebar } from "~/components/app-sidebar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "~/components/ui/breadcrumb";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "~/components/ui/sidebar";
import type { Route } from "./+types/dashboard-layout";
import { queriesStore } from "~/data/store/queries-store";

export async function clientLoader() {
  const data = queriesStore.getQueries()
  return data;
}

export default function DashboardLayout({loaderData}: Route.ComponentProps) {
    const data = loaderData;
    return <SidebarProvider>
      <AppSidebar queries={data} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="gap-4 h-[calc(100vh-calc(var(--spacing)*16))] overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
}