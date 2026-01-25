interface LoadingProps {
  message?: string;
  className?: string;
}

export function Loading({ message = 'Loading...', className = '' }: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mb-4" />
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
}

// Match header skeleton
export function MatchHeaderSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Competition bar */}
      <div className="bg-gray-50 px-4 py-2 border-b">
        <div className="skeleton-text w-48 h-4 mx-auto" />
      </div>

      {/* Score section */}
      <div className="py-6 px-6 animate-pulse">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Home team */}
          <div className="flex flex-col items-center gap-2 w-32">
            <div className="skeleton-circle w-16 h-16" />
            <div className="skeleton-text w-20 h-4" />
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-2 px-4">
            <div className="skeleton w-12 h-6 rounded" />
            <div className="skeleton w-32 h-12 rounded" />
            <div className="skeleton-text w-24 h-4" />
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center gap-2 w-32">
            <div className="skeleton-circle w-16 h-16" />
            <div className="skeleton-text w-20 h-4" />
          </div>
        </div>

        {/* xG bar */}
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex justify-between mb-1">
            <div className="skeleton-text w-16 h-4" />
            <div className="skeleton-text w-16 h-4" />
          </div>
          <div className="skeleton w-full h-2 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Lineup table skeleton
export function LineupSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-5 ${className}`}>
      <div className="skeleton-text w-24 h-6 mb-4" />
      <div className="space-y-2 animate-pulse">
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <div className="skeleton-circle w-8 h-8" />
            <div className="skeleton-text flex-1 h-4" />
            <div className="skeleton w-12 h-4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Stats section skeleton
export function StatsSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-5 ${className}`}>
      <div className="skeleton-text w-32 h-6 mb-4" />
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton-text w-24 h-3 mx-auto mb-2" />
            <div className="flex items-center gap-2">
              <div className="skeleton-text w-10 h-4" />
              <div className="flex-1 flex gap-0.5">
                <div className="skeleton flex-1 h-2 rounded-l-full" />
                <div className="skeleton flex-1 h-2 rounded-r-full" />
              </div>
              <div className="skeleton-text w-10 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Timeline chart skeleton
export function TimelineSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-5 ${className}`}>
      <div className="skeleton-text w-32 h-6 mb-4" />

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4 mb-6 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-3">
            <div className="skeleton-text w-16 h-3 mx-auto mb-2" />
            <div className="flex items-center gap-2">
              <div className="skeleton-text w-8 h-4" />
              <div className="skeleton flex-1 h-1.5 rounded-full" />
              <div className="skeleton-text w-8 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="skeleton w-full h-40 rounded-lg" />

      {/* Events list */}
      <div className="mt-4 space-y-2 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <div className="skeleton-text w-8 h-4" />
            <div className="skeleton-circle w-2.5 h-2.5" />
            <div className="skeleton-text flex-1 h-4" />
            <div className="skeleton-text w-12 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Pass network skeleton
export function PassNetworkSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-pitch-green rounded-xl p-4 ${className}`}>
      <div className="skeleton w-full h-64 rounded-lg opacity-20" />
    </div>
  );
}

// Shot map skeleton
export function ShotMapSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-pitch-green rounded-xl p-4 ${className}`}>
      <div className="skeleton w-full h-48 rounded-lg opacity-20" />
    </div>
  );
}

// Full page skeleton for match page
export function MatchPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <MatchHeaderSkeleton />
      <div className="grid md:grid-cols-2 gap-6">
        <TimelineSkeleton />
        <StatsSkeleton />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <LineupSkeleton />
        <LineupSkeleton />
      </div>
    </div>
  );
}

export default Loading;
