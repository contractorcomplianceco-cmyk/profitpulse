import { Link } from "wouter";
import { LogIn } from "lucide-react";
import DemoPlayer from "./DemoPlayer";
import "./demo.css";

/** Public video-first client demo — no login, walkthrough fills the viewport. */
export default function DemoWalkthrough() {
  return (
    <div className="hc-demo relative w-full min-h-[100dvh] h-[100dvh] overflow-hidden bg-[#071827]">
      <DemoPlayer alwaysShowControls />
      <Link href="/auth/login">
        <div className="absolute bottom-4 right-4 z-[60] flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black/35 hover:bg-black/55 text-white/70 hover:text-white text-[11px] md:text-xs font-medium backdrop-blur-sm transition-colors cursor-pointer border border-white/10">
          <LogIn className="w-3.5 h-3.5 shrink-0" />
          <span>Sign in to workspace</span>
        </div>
      </Link>
    </div>
  );
}
