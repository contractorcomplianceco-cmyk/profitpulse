import { motion } from "framer-motion";

export function SceneCaption({
  sceneIndex,
  sceneCount,
  label,
  caption,
  visible = true,
}: {
  sceneIndex?: number;
  sceneCount?: number;
  label: string;
  caption: string;
  visible?: boolean;
}) {
  if (!visible) return null;

  return (
    <motion.div
      className="absolute bottom-20 sm:bottom-24 md:bottom-28 left-0 right-0 z-40 px-3 sm:px-4 md:px-8 pointer-events-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-3xl mx-auto rounded-xl border border-white/10 bg-black/50 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#49BFF2]">
            {label}
          </p>
          {sceneIndex != null && sceneCount != null && (
            <p className="text-[10px] font-mono text-white/35 shrink-0">
              {sceneIndex}/{sceneCount}
            </p>
          )}
        </div>
        <p className="text-sm md:text-lg font-body text-white/95 leading-snug">{caption}</p>
      </div>
    </motion.div>
  );
}

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 56;
  const h = 22;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="opacity-80" aria-hidden>
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} strokeLinecap="round" />
    </svg>
  );
}

export { MiniSparkline };
