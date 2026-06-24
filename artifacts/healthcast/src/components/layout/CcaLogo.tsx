import { brand, productFullName } from "@/brand/brandConfig";

/**
 * Brand mark. Reads the logo + product name from the white-label brand config.
 * (Component name kept as CcaLogo for import stability across the app.)
 */
export function CcaLogo({ className }: { className?: string }) {
  return (
    <img
      src={brand.logoSrc}
      alt={`${productFullName} — ${brand.companyName}`}
      className={`object-contain${className ? ` ${className}` : ""}`}
    />
  );
}
