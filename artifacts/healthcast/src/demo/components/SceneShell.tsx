import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { SceneCaption } from "./SceneCaption";
import { sceneMetaFor, SCENE_COUNT } from "../sceneMeta";

const enter = {
  opacity: 0,
  scale: 0.94,
  filter: "blur(12px)",
  y: 18,
};

const center = {
  opacity: 1,
  scale: 1,
  filter: "blur(0px)",
  y: 0,
};

const exit = {
  opacity: 0,
  scale: 1.04,
  filter: "blur(14px)",
  y: -12,
};

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
      className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-2 ${className}`}
      initial={enter}
      animate={center}
      exit={exit}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
      {meta && (
        <SceneCaption
          sceneIndex={meta.index}
          sceneCount={SCENE_COUNT}
          label={meta.label}
          caption={meta.caption}
        />
      )}
    </motion.div>
  );
}
