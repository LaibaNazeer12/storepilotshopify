import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Megaphone, MessagesSquare, Compass, Plane } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Marketing Studio", url: "/marketing", icon: Megaphone },
  { title: "Customer Insights", url: "/insights", icon: MessagesSquare },
  { title: "Store Advisor", url: "/advisor", icon: Compass },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1 py-2">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Plane className="size-4 -rotate-45" />
          </div>
          <div className="leading-tight group-data-[collapsible=icon]:hidden">
            <div className="font-display text-sm font-semibold text-sidebar-accent-foreground">StorePilot AI</div>
            <div className="text-xs text-sidebar-foreground/70">for Shopify owners</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={path === item.url} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="rounded-lg bg-sidebar-accent p-3 text-xs text-sidebar-foreground group-data-[collapsible=icon]:hidden">
          <div className="font-semibold text-sidebar-accent-foreground">Shopify not connected</div>
          Dashboard shows demo data.
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
