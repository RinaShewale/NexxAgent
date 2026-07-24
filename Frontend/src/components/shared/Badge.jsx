const variants = {
  green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
  yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  violet: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  gray: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
};

export default function Badge({ label, variant = 'gray', dot = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full border ${variants[variant]}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`} />
      )}
      {label}
    </span>
  );
}
