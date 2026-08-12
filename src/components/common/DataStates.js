const COLORS = {
  primary: "#E76F51",
  secondary: "#F4A261",
  accent: "#E9C46A",
  background: "#FDF6EC",
  surface: "#FFFFFF",
  textSecondary: "#6B6B6B",
};

// Grid of pulsing placeholder cards — used wherever a card/image grid is loading.
export function SkeletonGrid({ count = 6, className = "grid sm:grid-cols-2 md:grid-cols-3 gap-8" }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl animate-pulse"
          style={{ background: COLORS.accent + "33", height: 260 }}
        />
      ))}
    </div>
  );
}

// Single-line/paragraph shimmer — used for profile fields, table rows, etc.
export function SkeletonLines({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg animate-pulse"
          style={{ background: COLORS.accent + "33", height: 18, width: `${80 - i * 10}%` }}
        />
      ))}
    </div>
  );
}

export function EmptyState({ message = "Nothing here yet.", action }) {
  return (
    <div className="text-center py-16 px-4">
      <p className="font-serif text-lg mb-4" style={{ color: COLORS.secondary }}>
        {message}
      </p>
      {action}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong loading this content.", onRetry }) {
  return (
    <div className="text-center py-16 px-4">
      <p className="font-medium mb-4" style={{ color: COLORS.primary }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 rounded-lg font-semibold transition"
          style={{ background: COLORS.primary, color: COLORS.surface }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

export { COLORS as SHARED_COLORS };
