import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { sound } from "@/lib/sound";

export function SoundToggle({ className = "" }: { className?: string }) {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    setIsEnabled(sound.getSoundState());
  }, []);

  const handleToggle = () => {
    const newState = sound.toggleSound();
    setIsEnabled(newState);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isEnabled ? "Mute website sound" : "Unmute website sound"}
      data-cursor="sound"
      data-magnetic="true"
      className={`label-track flex items-center gap-1.5 px-3 py-1.5 !text-[9px] border rounded transition-all duration-300 cursor-pointer ${
        isEnabled
          ? "border-gold/60 bg-gold/10 text-gold shadow-[0_0_12px_rgba(201,164,76,0.15)]"
          : "border-border/60 text-muted-foreground hover:text-ivory hover:border-border"
      } ${className}`}
    >
      {isEnabled ? (
        <>
          <Volume2 size={13} className="text-gold animate-pulse" />
          <span className="font-mono">SOUND ON</span>
        </>
      ) : (
        <>
          <VolumeX size={13} />
          <span className="font-mono">SOUND OFF</span>
        </>
      )}
    </button>
  );
}
