import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

interface MusicPlayerProps {
  audioUrl?: string;
  autoPlayTrigger?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  audioUrl = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=tender-piano-ambient-112191.mp3',
  autoPlayTrigger = false 
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoPlayTrigger && audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay policy prevented playback until explicit click
      });
    }
  }, [autoPlayTrigger]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Audio play error:', err);
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
      />
      <div className="flex items-center gap-1.5 p-1.5 bg-[#F6F1E7]/95 backdrop-blur-md rounded-full shadow-lg border border-[#DECDB3] text-[#3D473F]">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause music' : 'Play background music'}
          className="w-9 h-9 rounded-full bg-[#5F7D65] text-[#FAF7F2] flex items-center justify-center hover:bg-[#4E6853] transition-colors shadow-sm cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#6A6357] hover:text-[#2E352F] transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="hidden sm:flex items-center gap-1 pr-3 text-xs text-[#6A6357] font-medium select-none">
          <Music className={`w-3.5 h-3.5 text-[#5F7D65] ${isPlaying ? 'animate-bounce' : ''}`} />
          <span className="truncate max-w-[110px]">Gentle Melody</span>
        </div>
      </div>
    </div>
  );
};
