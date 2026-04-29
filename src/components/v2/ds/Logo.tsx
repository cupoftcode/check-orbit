export default function Logo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label="CheckOrbit"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="coLogoG" x1="15%" y1="85%" x2="85%" y2="15%">
          <stop offset="0%"   stopColor="#C45327" />
          <stop offset="30%"  stopColor="#DE6438" />
          <stop offset="50%"  stopColor="#E8A972" />
          <stop offset="70%"  stopColor="#BDD9F0" />
          <stop offset="100%" stopColor="#5B9BC5" />
        </linearGradient>
      </defs>
      <g transform="rotate(-35 50 50)">
        <rect
          x="10" y="32" width="80" height="36"
          rx="18"
          fill="none"
          stroke="url(#coLogoG)"
          strokeWidth="10"
        />
      </g>
    </svg>
  );
}

export function WordMark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 font-display font-extrabold text-[22px] tracking-tight text-ink ${className}`}>
      <Logo size={28} />
      <span>
        Check<span className="opacity-60 font-bold">Orbit</span>
      </span>
    </span>
  );
}
