import { Link } from "wouter";
import { LogIn, PlayCircle } from "lucide-react";
import DemoPlayer from "./DemoPlayer";
import "./demo.css";

/** Public video-first client demo — no login, walkthrough fills the viewport. */
export default function DemoWalkthrough() {
  return (
    <div className="hc-demo relative w-full min-h-[100dvh] h-[100dvh] overflow-hidden bg-[#071827]">
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-[58] pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/45 border border-white/10 backdrop-blur-sm"
        role="status"
      >
        <PlayCircle className="w-3.5 h-3.5 text-[#49BFF2]" aria-hidden />
        <span className="text-[10px] md:text-xs text-white/75 font-body tracking-wide">
          Product demo · sample data · narration on
        </span>
      </div>
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
