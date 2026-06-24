import { motion, AnimatePresence } from 'framer-motion';

const IMG_BASE = `${import.meta.env.BASE_URL}demo/images`;

export function ScreenFrame({
  image,
  url,
  durationSec = 11,
  className = '',
}: {
  image: string;
  url: string;
  durationSec?: number;
  className?: string;
}) {
  const src = `${IMG_BASE}/${image}.jpg`;
  return (
    <div
      className={`relative rounded-xl overflow-hidden border border-white/10 bg-[#0b1424] shadow-2xl shadow-black/60 ${className}`}
    >
      {/* Browser chrome */}
      <div className="h-10 flex items-center gap-3 px-4 bg-[#0b1424] border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#fb7185]/70" />
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]/70" />
          <div className="w-3 h-3 rounded-full bg-[#34d399]/70" />
        </div>
        <div className="flex-1 mx-2 h-6 rounded-md bg-white/5 border border-white/5 flex items-center px-3">
          <span className="text-[11px] text-white/45 font-body tracking-wide truncate">{url}</span>
        </div>
      </div>

      {/* Screenshot with crossfade + Ken Burns */}
      <div className="relative overflow-hidden bg-[#0b1424]" style={{ aspectRatio: '1440 / 1024' }}>
        <AnimatePresence>
          <motion.img
            key={src}
            src={src}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover object-top select-none"
            initial={{ opacity: 0, scale: 1.06, y: '0%' }}
            animate={{ opacity: 1, scale: 1.14, y: '-3%' }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.6, ease: 'easeOut' },
              scale: { duration: durationSec, ease: 'linear' },
              y: { duration: durationSec, ease: 'linear' },
            }}
          />
        </AnimatePresence>
        {/* subtle screen glare */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/0 to-white/[0.04]" />
      </div>
    </div>
  );
}
