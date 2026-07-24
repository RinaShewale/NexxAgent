export default function IconButton({ onClick, title, children, className = '', disabled = false, active = false }) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`
        flex items-center justify-center w-7 h-7 rounded-md text-gray-400 transition-all duration-150
        hover:text-white hover:bg-white/10
        active:scale-95
        disabled:opacity-40 disabled:cursor-not-allowed
        ${active ? 'text-violet-400 bg-violet-500/15' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
