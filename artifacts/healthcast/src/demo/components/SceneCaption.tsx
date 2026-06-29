import { motion } from "framer-motion";

export function SceneCaption({
  label,
  caption,
  visible = true,
}: {
  label: string;
  caption: string;
  visible?: boolean;
}) {
  if (!visible) return null;

  return (
    <motion.div
      className="absolute bottom-24 md:bottom-28 left-0 right-0 z-40 px-4 md:px-8 pointer-events-none"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-3xl mx-auto rounded-xl border border-white/10 bg-black/45 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 shadow-xl">
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#49BFF2] mb-1">
          {label}
        </p>
        <p className="text-sm md:text-lg font-body text-white/95 leading-snug">{caption}</p>
      </div>
    </motion.div>
  );
}
