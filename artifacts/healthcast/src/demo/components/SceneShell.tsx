import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { SceneCaption } from "./SceneCaption";
import { sceneMetaFor } from "../sceneMeta";

export function SceneShell({
  sceneKey,
  children,
  className = "",
}: {
  sceneKey: string;
  children: ReactNode;
  className?: string;
}) {
  const meta = sceneMetaFor(sceneKey);

  return (
    <motion.div
      className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(6px)" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
      {meta && <SceneCaption label={meta.label} caption={meta.caption} />}
    </motion.div>
  );
}
