import { SVGProps } from "react";

export function CcaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" fill="url(#cca-logo-bg)" stroke="url(#cca-logo-border)" strokeWidth="1.5"/>
      <path d="M16 6L24.5 11V21L16 26L7.5 21V11L16 6Z" fill="hsl(var(--background))" stroke="url(#cca-logo-inner)" strokeWidth="1" strokeOpacity="0.6"/>
      <text x="16" y="19" fontSize="10" fontWeight="bold" fill="hsl(var(--foreground))" textAnchor="middle" letterSpacing="0.5" fontFamily="sans-serif">
        CCA
      </text>
      <defs>
        <linearGradient id="cca-logo-bg" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(var(--primary))" stopOpacity="0.35"/>
          <stop offset="1" stopColor="hsl(var(--cyan))" stopOpacity="0.08"/>
        </linearGradient>
        <linearGradient id="cca-logo-border" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(var(--cyan))"/>
          <stop offset="0.5" stopColor="hsl(var(--primary))"/>
          <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0.3"/>
        </linearGradient>
        <linearGradient id="cca-logo-inner" x1="7.5" y1="6" x2="24.5" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(var(--cyan))"/>
          <stop offset="1" stopColor="hsl(var(--primary))"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
