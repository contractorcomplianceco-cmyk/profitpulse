import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import DemoPlayer from "./DemoPlayer";
import "./demo.css";

export default function DemoWalkthrough() {
  return (
    <div className="hc-demo relative w-full h-screen overflow-hidden bg-[#071827]">
      <DemoPlayer />
      <Link href="/">
        <div className="absolute top-5 left-5 z-[60] flex items-center gap-2 px-3.5 py-2 rounded-lg bg-black/40 hover:bg-black/60 text-white/80 hover:text-white text-sm font-medium backdrop-blur-sm transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Back to HealthCast
        </div>
      </Link>
    </div>
  );
}
