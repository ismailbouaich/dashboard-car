import { AppSidebar } from "../../components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppHeader from "../app-header"

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
        
        <AppSidebar />
        <SidebarInset >{children}</SidebarInset>
     
    </SidebarProvider>
  )
}