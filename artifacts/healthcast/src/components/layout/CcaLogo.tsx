import logoUrl from "@assets/cca-crest-inset_1781453529147.png";

export function CcaLogo({ className }: { className?: string }) {
  return (
    <img
      src={logoUrl}
      alt="CCA HealthCast OS"
      className={`object-contain${className ? ` ${className}` : ""}`}
    />
  );
}
