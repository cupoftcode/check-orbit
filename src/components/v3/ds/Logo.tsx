type LogoProps = {
  className?: string;
  gradientId?: string;
};

export default function Logo({ className, gradientId = "v3LogoGradient" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="15%" y1="85%" x2="85%" y2="15%">
          <stop offset="0%" stopColor="#C45327" />
          <stop offset="30%" stopColor="#DE6438" />
          <stop offset="50%" stopColor="#E8A972" />
          <stop offset="70%" stopColor="#BDD9F0" />
          <stop offset="100%" stopColor="#5B9BC5" />
        </linearGradient>
      </defs>
      <g transform="rotate(-35 50 50)">
        <rect
          x="10"
          y="32"
          width="80"
          height="36"
          rx="18"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="10"
        />
      </g>
    </svg>
  );
}
