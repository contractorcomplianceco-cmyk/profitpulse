import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { SceneCaption } from "./SceneCaption";
import { sceneMetaFor, SCENE_COUNT } from "../sceneMeta";

const enter = {
  opacity: 0,
  scale: 0.96,
  filter: "blur(8px)",
};

const center = {
  opacity: 1,
  scale: 1,
  filter: "blur(0px)",
};

const exit = {
  opacity: 0,
  scale: 1.03,
  filter: "blur(10px)",
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
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
