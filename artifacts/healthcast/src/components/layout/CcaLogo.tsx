import { useBrand, useProductFullName } from "@/brand/BrandProvider";
import { resolveAsset } from "@/lib/asset";

/**
 * Brand mark. Reads the active (live, white-labelable) logo + product name from
 * the brand context. (Component name kept as CcaLogo for import stability.)
 */
export function CcaLogo({ className }: { className?: string }) {
  const { brand } = useBrand();
  const fullName = useProductFullName();
  return (
    <img
      src={resolveAsset(brand.logoSrc)}
      alt={`${fullName} — ${brand.companyName}`}
      className={`object-contain${className ? ` ${className}` : ""}`}
    />
  );
}
