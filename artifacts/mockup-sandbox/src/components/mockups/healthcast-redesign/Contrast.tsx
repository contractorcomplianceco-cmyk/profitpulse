import "./_group.css";
import "./_contrast.css";
import { AppShell } from "./_shared/AppShell";
import { ExecutiveContent } from "./_shared/ExecutiveContent";

export function Contrast() {
  return (
    <AppShell showIcons variantClass="variant-contrast">
      <ExecutiveContent showIcons />
    </AppShell>
  );
}
