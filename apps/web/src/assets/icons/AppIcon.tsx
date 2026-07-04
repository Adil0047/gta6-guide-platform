type AppIconProps = {
  className?: string;
};

export function AppIcon({ className }: AppIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="GTA VI Guide Platform icon"
      className={className}
      fill="none"
    >
      <rect width="64" height="64" rx="18" fill="#08080B" />
      <rect x="1" y="1" width="62" height="62" rx="17" stroke="white" strokeOpacity="0.12" />
      <path
        d="M17 18L28.5 46H35.5L47 18H39.2L32.1 37.7L24.9 18H17Z"
        fill="url(#paint0_linear)"
      />
      <path d="M47 18H55V46H47V18Z" fill="white" />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="17"
          y1="18"
          x2="47.5"
          y2="45.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF3CAC" />
          <stop offset="1" stopColor="#00E5FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
