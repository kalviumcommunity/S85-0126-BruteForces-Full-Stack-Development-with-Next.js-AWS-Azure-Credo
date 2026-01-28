export const dynamic = "force-dynamic"; // Force dynamic rendering for this demo

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // 1. Simulate Network Delay (3 Seconds)
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // 2. Simulate Error (if ?error=true is in URL)
  // Awaiting searchParams is required in Next.js 15
  const params = await searchParams;
  const shouldFail = params?.error === "true";

  if (shouldFail) {
    throw new Error("Failed to load dashboard data due to a simulated server error.");
  }

  // 3. Success Content
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="p-6 border rounded-xl shadow-sm bg-white">
            <h3 className="font-semibold text-lg mb-2">Metric #{item}</h3>
            <p className="text-3xl font-bold text-blue-600">
              {Math.floor(Math.random() * 1000)}
            </p>
            <p className="text-gray-500 text-sm mt-2">Updated just now</p>
          </div>
        ))}
      </div>
    </div>
  );
}