import { CarsTable } from '@/components/dashboard/SeedData';
import { useDashboard } from '@/context/DashboardContext';
import { Link } from 'react-router-dom';

export default function DashboardHome() {
  const { dashboardStats, isLoading } = useDashboard();
  const hasData = Object.values(dashboardStats).some(value => value > 0);
  
 
 
  
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <div className="aspect-video rounded-xl bg-muted/50" />
      <div className="aspect-video rounded-xl bg-muted/50" />
      <div className="aspect-video rounded-xl bg-muted/50" />
    </div>
    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    <Link 
  to="/vehicles" 
  onClick={() => console.log("Vehicles link clicked, navigating to /admin/vehicles")}
>
  Vehicles
</Link>
  </div>  );
}