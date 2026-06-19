import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, RotateCcw,
  FileText, Download, Compass, Video, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { onboardingSections } from "@/data/onboardingData";
import { renderScene } from "@/components/dashboard/WelcomeScenes";

const base = import.meta.env.BASE_URL;

export default function Welcome() {
  const { toast } = useToast();
  
  const [mode, setMode] = useState<"narrated" | "guided">("narrated");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  // Monotonic token: every stop or new playback invalidates any in-flight async play()
  const sessionRef = useRef(0);
  const isMutedRef = useRef(isMuted);
  const modeRef = useRef(mode);
  isMutedRef.current = isMuted;
  modeRef.current = mode;

  const stopAllAudio = useCallback(() => {
    sessionRef.current++; // invalidate any in-flight playCurrentAudio task
    setIsPlaying(false);
    const audio = audioRef.current;
    const music = musicRef.current;
    if (audio) {
      audio.onended = null;
      audio.ontimeupdate = null;
      audio.onerror = null;
      audio.pause();
      audio.currentTime = 0;
    }
    if (music) {
      music.pause();
      music.currentTime = 0;
    }
  }, []);

  const playAudioForIndex = useCallback((index: number) => {
    const audio = audioRef.current;
    const music = musicRef.current;
    if (modeRef.current === "guided" || !audio || !music) return;

    const session = ++sessionRef.current; // claim a new playback session
    const section = onboardingSections[index];
    audio.src = `${base}onboarding/${section.audioFile}`;
    audio.currentTime = 0;
    audio.muted = isMutedRef.current;
    music.muted = isMutedRef.current;

    audio.ontimeupdate = () => {
      if (session !== sessionRef.current) return;
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.onended = () => {
      if (session !== sessionRef.current) return;
      if (index < onboardingSections.length - 1) {
        setCurrentIndex(index + 1);
        setProgress(0);
        playAudioForIndex(index + 1);
      } else {
        setIsCompleted(true);
        stopAllAudio();
      }
    };

    audio.onerror = () => {
      if (session !== sessionRef.current) return;
      toast({
        title: "Audio Error",
        description: "Could not load narration audio.",
        variant: "destructive",
      });
      stopAllAudio();
    };

    audio
      .play()
      .then(() => {
        // Bail if a stop/mode-switch/new-play happened during the await.
        // Do NOT pause here: a newer session (or stopAllAudio) already owns the element.
        if (session !== sessionRef.current) return undefined;
        setIsPlaying(true);
        return music.play();
      })
      .then(() => {
        // If stale, the element is already controlled by a newer session/stop; no-op.
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        if (session !== sessionRef.current) return;
        setIsPlaying(false);
      });
  }, [stopAllAudio, toast]);

  // Resume the current clip without re-initializing it. Captures (does NOT bump)
  // the active session so a concurrent stop/mode-switch/unmount cancels the resume
  // and so the existing timeupdate/ended/error handlers stay valid.
  const resumePlayback = useCallback(() => {
    const audio = audioRef.current;
    const music = musicRef.current;
    if (!audio || !music) return;
    const session = sessionRef.current;
    audio
      .play()
      .then(() => {
        if (session !== sessionRef.current) return undefined;
        setIsPlaying(true);
        return music.play();
      })
      .then(() => {
        // no-op when stale; element is owned by a newer session/stop
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        if (session !== sessionRef.current) return;
        setIsPlaying(false);
      });
  }, []);

  // Initialize audio elements
  useEffect(() => {
    audioRef.current = new Audio();
    const music = new Audio(`${base}onboarding/music-bed.mp3`);
    music.loop = true;
    music.volume = 0.15;
    musicRef.current = music;

    return () => {
      stopAllAudio();
    };
  }, [stopAllAudio]);

  // Handle mode switch — always stop all audio first
  const handleModeChange = (newMode: "narrated" | "guided") => {
    stopAllAudio();
    setMode(newMode);
    setCurrentIndex(0);
    setProgress(0);
    setIsCompleted(false);
  };

  // Restart from the beginning (resumes narration in narrated mode)
  const handleRestart = () => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setProgress(0);
    if (mode === "narrated") {
      playAudioForIndex(0);
    } else {
      stopAllAudio();
    }
  };

  // Handle play/pause toggle (narrated mode)
  const togglePlay = () => {
    if (isCompleted) {
      handleRestart();
      return;
    }

    if (isPlaying) {
      // Pause without invalidating the session so resume keeps the same clip/handlers
      audioRef.current?.pause();
      musicRef.current?.pause();
      setIsPlaying(false);
    } else {
      const audio = audioRef.current;
      if (audio?.src && audio.currentTime > 0 && !audio.ended) {
        resumePlayback();
      } else {
        playAudioForIndex(currentIndex);
      }
    }
  };

  // Jump the player to a specific section (sets index first, then plays it)
  const goToIndex = (index: number) => {
    setIsCompleted(false);
    setProgress(0);
    setCurrentIndex(index);
    if (mode === "narrated") {
      playAudioForIndex(index);
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioRef.current) audioRef.current.muted = newMuted;
    if (musicRef.current) musicRef.current.muted = newMuted;
  };

  // Navigation for Guided Tour (no audio)
  const handleNext = () => {
    if (currentIndex < onboardingSections.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsCompleted(false);
    }
  };

  const currentSection = onboardingSections[currentIndex];

  return (
    <div className="flex flex-col gap-6 pb-12 w-full max-w-6xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-card border border-border rounded-xl p-8 surface-gradient shadow-lg shadow-black/20 flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan via-primary to-primary opacity-70" />
        
        <div className="flex items-center gap-5 z-10">
          <div className="w-14 h-14 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 shadow-lg shadow-primary/10">
            <Compass className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-foreground tracking-tight mb-1">Welcome to CCA HealthCast OS</h2>
            <p className="text-muted-foreground text-sm font-medium">Get oriented with a narrated tour, a self-paced guide, or our detailed documentation.</p>
          </div>
        </div>

        <Button asChild variant="outline" className="z-10 border-primary/30 hover:bg-primary/10 hover:border-primary/50 font-bold h-12 px-6">
          <a href={`${base}onboarding/cca-healthcast-user-guide.pdf`} target="_blank" rel="noopener noreferrer">
            <FileText className="w-5 h-5 mr-2 text-primary" />
            User Guide (PDF)
          </a>
        </Button>
      </div>

      {/* Mode Toggle */}
      <div className="flex flex-col items-center justify-center my-4">
        <div className="bg-secondary/40 p-1.5 rounded-full border border-border/50 inline-flex shadow-inner mb-3">
          <button
            onClick={() => handleModeChange("narrated")}
            aria-pressed={mode === "narrated"}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              mode === "narrated" 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Video className="w-4 h-4" /> Narrated Video
          </button>
          <button
            onClick={() => handleModeChange("guided")}
            aria-pressed={mode === "guided"}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              mode === "guided" 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Compass className="w-4 h-4" /> Guided Tour
          </button>
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          {mode === "narrated" ? "Sit back and watch a guided walkthrough of the terminal." : "Step through the features at your own pace."}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Player Card (2/3 width on large screens) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl shadow-black/30 flex flex-col">
            {/* Header info */}
            <div className="px-6 py-4 border-b border-border/50 bg-secondary/20 flex justify-between items-center">
              <div>
                <div className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">
                  {mode === "narrated" ? `CHAPTER ${currentIndex + 1} OF ${onboardingSections.length}` : `STEP ${currentIndex + 1} OF ${onboardingSections.length}`}
                </div>
                <h3 className="text-xl font-black text-foreground">{currentSection?.title || "Complete"}</h3>
              </div>
            </div>

            {/* 16:9 Stage */}
            <div className="relative w-full aspect-video bg-[#0a0f1a] overflow-hidden">
              <AnimatePresence mode="wait">
                {!isCompleted ? (
                  <motion.div
                    key={currentSection.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    {renderScene(currentSection.id, true)}
                  </motion.div>
                ) : (
                  <motion.div
                    key="completed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-card surface-gradient"
                  >
                    <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_hsl(var(--success)/0.3)]">
                      <Compass className="w-10 h-10 text-success" />
                    </div>
                    <h3 className="text-3xl font-black text-foreground mb-2">You're all set.</h3>
                    <p className="text-muted-foreground max-w-md mb-8">
                      You've completed the orientation. You're ready to explore CCA HealthCast OS.
                    </p>
                    <div className="flex gap-4">
                      <Button onClick={handleRestart} variant="outline" className="font-bold">
                        <RotateCcw className="w-4 h-4 mr-2" /> Replay Tour
                      </Button>
                      <Button asChild className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/">
                          Enter Terminal <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Narrated Mode Play Overlay */}
              {mode === "narrated" && !isPlaying && !isCompleted && progress === 0 && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50">
                  <button
                    onClick={togglePlay}
                    className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-[0_0_40px_hsl(var(--primary)/0.6)] hover:scale-105 transition-transform"
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </button>
                </div>
              )}
            </div>

            {/* Controls Area */}
            <div className="px-6 py-4 bg-secondary/30 border-t border-border/50">
              {mode === "narrated" ? (
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors border border-primary/30 flex-shrink-0">
                    {isPlaying ? <Pause className="w-5 h-5" /> : (isCompleted ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />)}
                  </button>
                  
                  {/* Segmented Progress Bar */}
                  <div className="flex-1 flex gap-1.5 items-center h-2">
                    {onboardingSections.map((_, i) => (
                      <div key={i} className="flex-1 h-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-200"
                          style={{ 
                            width: isCompleted || i < currentIndex ? "100%" : i === currentIndex ? `${progress}%` : "0%"
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <button onClick={toggleMute} className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handlePrev} 
                    disabled={currentIndex === 0 || isCompleted}
                    className="border-border/50"
                  >
                    <SkipBack className="w-4 h-4 mr-2" /> Back
                  </Button>

                  {/* Segmented Progress Bar for Guided Mode */}
                  <div className="flex-1 flex gap-1.5 items-center h-2 mx-6">
                    {onboardingSections.map((_, i) => (
                      <div key={i} className="flex-1 h-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan transition-all duration-300"
                          style={{ 
                            width: isCompleted || i <= currentIndex ? "100%" : "0%"
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {!isCompleted ? (
                    <Button 
                      onClick={handleNext} 
                      className="bg-cyan hover:bg-cyan/90 text-white font-bold"
                    >
                      Next <SkipForward className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleRestart}
                      className="bg-cyan hover:bg-cyan/90 text-white font-bold"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" /> Restart
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chapters / Steps List */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-border rounded-xl p-5 shadow-lg shadow-black/20 flex flex-col flex-1">
            <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-4">
              {mode === "narrated" ? "Chapters" : "Steps"}
            </h3>
            
            <div className="flex flex-col gap-2 flex-1">
              {onboardingSections.map((section, i) => (
                <div 
                  key={section.id}
                  onClick={() => goToIndex(i)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col gap-1 ${
                    !isCompleted && currentIndex === i 
                      ? "bg-primary/10 border-primary/50 shadow-md shadow-primary/5" 
                      : "bg-secondary/20 border-border/50 hover:bg-secondary/40 hover:border-border"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-bold ${!isCompleted && currentIndex === i ? 'text-foreground' : 'text-foreground'}`}>
                      {i + 1}. {section.title}
                    </span>
                    {/* Deep link into the actual app route */}
                    <Button asChild variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100 hover:bg-primary/20 hover:text-primary">
                      <Link href={section.route} title={`Go to ${section.title}`} onClick={(e) => e.stopPropagation()}>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium leading-snug">
                    {section.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer User Guide Card */}
          <div className="surface-gradient-accent border border-border rounded-xl p-5 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-cyan" />
              <h3 className="text-sm font-bold text-foreground">Full Documentation</h3>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Prefer reading? Download the comprehensive PDF guide covering every feature and setting in detail.
            </p>
            <Button asChild variant="secondary" className="w-full mt-2 font-bold bg-secondary/50 hover:bg-secondary border border-border/50 text-[13px] h-9">
              <a href={`${base}onboarding/cca-healthcast-user-guide.pdf`} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
