import "./_group.css";
import "./_graphite.css";
import { AppShell } from "./_shared/AppShell";
import { ExecutiveContent } from "./_shared/ExecutiveContent";

export function Graphite() {
  return (
    <AppShell showIcons variantClass="variant-graphite">
      <ExecutiveContent showIcons />
    </AppShell>
  );
}
