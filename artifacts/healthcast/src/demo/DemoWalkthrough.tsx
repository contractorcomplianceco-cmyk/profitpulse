import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import DemoPlayer from "./DemoPlayer";
import "./demo.css";

export default function DemoWalkthrough() {
  return (
    <div className="hc-demo relative w-full min-h-[100dvh] h-[100dvh] overflow-hidden bg-[#071827]">
      <DemoPlayer />
      <Link href="/auth/login">
        <div className="absolute top-4 left-4 z-[60] flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 hover:bg-black/60 text-white/80 hover:text-white text-xs md:text-sm font-medium backdrop-blur-sm transition-colors cursor-pointer max-w-[calc(100%-2rem)]">
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span className="truncate">Sign in to ProfitPulse</span>
        </div>
      </Link>
    </div>
  );
}
