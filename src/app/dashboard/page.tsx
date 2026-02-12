import { getDashboardData } from '@/actions/getDashboardData';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export default async function DashboardPage() {
  const data = await getDashboardData();

  return <DashboardClient data={data} />;
}

