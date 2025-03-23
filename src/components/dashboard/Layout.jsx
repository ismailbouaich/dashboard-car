import { AppSidebar } from "../../components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppHeader from "../app-header"
import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
  console.log("DashboardLayout is rendering");

  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          {/* This is the key change - use Outlet instead of children */}
          <div className="p-4">
            <Outlet />
          </div>
        </SidebarInset>
    </SidebarProvider>
  )
}