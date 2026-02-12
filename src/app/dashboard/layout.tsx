import { DashboardSidebar, MobileDashboardNav } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background relative">
      <DashboardSidebar />
      <MobileDashboardNav />
      {children}
    </div>
  );
}
