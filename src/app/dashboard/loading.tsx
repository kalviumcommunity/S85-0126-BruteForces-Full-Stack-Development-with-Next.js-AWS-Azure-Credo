export default function Loading() {
  return (
    <div className="p-8 space-y-8 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-10 bg-gray-200 rounded w-1/4"></div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}