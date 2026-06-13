import { SVGProps } from "react";

export function CcaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" fill="url(#cca-logo-bg)" stroke="url(#cca-logo-border)" strokeWidth="1.5"/>
      <path d="M16 6L24.5 11V21L16 26L7.5 21V11L16 6Z" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.5"/>
      <text x="16" y="19" fontSize="10" fontWeight="bold" fill="hsl(var(--foreground))" textAnchor="middle" letterSpacing="0.5" fontFamily="sans-serif">
        CCA
      </text>
      <defs>
        <linearGradient id="cca-logo-bg" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(var(--primary))" stopOpacity="0.2"/>
          <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0.05"/>
        </linearGradient>
        <linearGradient id="cca-logo-border" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(var(--primary))"/>
          <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0.3"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
