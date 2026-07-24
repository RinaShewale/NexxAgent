export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-red-950/60 border border-red-500/40 rounded-lg text-red-300 text-sm">
      <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-2 py-1 text-xs bg-red-500/20 hover:bg-red-500/40 rounded border border-red-500/30 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
