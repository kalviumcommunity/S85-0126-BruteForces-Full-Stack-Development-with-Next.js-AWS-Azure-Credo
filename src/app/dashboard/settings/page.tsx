import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/server-auth';
import { SettingsForm } from '@/components/dashboard/SettingsForm';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function SettingsPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/login');
  }

  const business = await prisma.business.findFirst({
    where: { ownerId: user.id },
  });

  if (!business) {
    return (
        <div className="max-w-2xl mx-auto py-12 text-center">
            <h1 className="text-2xl font-bold mb-4">No Business Profile Found</h1>
            <p className="text-muted-foreground mb-8">You haven't registered a business yet.</p>
            <Link href="/business/new">
                <Button>Register Business</Button>
            </Link>
        </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your business profile, images, and verification documents.</p>
        </div>
        
        <SettingsForm business={business} />
    </div>
  );
}
