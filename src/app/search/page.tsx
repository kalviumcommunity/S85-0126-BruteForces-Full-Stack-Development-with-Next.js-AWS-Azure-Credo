import { prisma } from '@/lib/db';
import SearchClient from '@/components/search/SearchClient';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || '';

  const businesses = query
    ? await prisma.business.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { address: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { receivedVouches: true },
        orderBy: { trust_score: 'desc' },
      })
    : [];

  return <SearchClient initialBusinesses={businesses} />;
}
