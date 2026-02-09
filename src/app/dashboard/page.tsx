import { getDashboardData } from '@/actions/getDashboardData';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { DashboardSidebar, MobileDashboardNav } from '@/components/dashboard/Sidebar';

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="flex min-h-screen w-full bg-background relative">
      <DashboardSidebar />
      <MobileDashboardNav />
      <DashboardClient data={data} />
    </div>
  );
}
