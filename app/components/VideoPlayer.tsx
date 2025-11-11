"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface VideoPlayerProps {
  videoPath: string;
  title?: string;
}

export function VideoPlayer({ videoPath, title = "Clustering Explained Simply" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Only render video after component mounts on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (typeof window === 'undefined' || !videoRef.current) return;
    
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {
        // Handle fullscreen error (e.g., user denied)
      });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {
        // Handle exit fullscreen error
      });
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  // Don't render video until mounted (client-side only) to avoid hydration mismatch
  if (!isMounted) {
    return (
      <Card className="border-2 border-primary/30 shadow-xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading video...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/30 shadow-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full bg-black group">
          <video
            ref={videoRef}
            src={videoPath}
            className="w-full h-auto"
            onEnded={handleVideoEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
            controls={false}
          />
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="secondary"
                size="icon"
                onClick={togglePlay}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
              
              <Button
                variant="secondary"
                size="icon"
                onClick={toggleMute}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
              
              <Button
                variant="secondary"
                size="icon"
                onClick={toggleFullscreen}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                <Maximize2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Play Button Overlay (when paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="lg"
                  onClick={togglePlay}
                  className="rounded-full w-20 h-20 bg-primary/90 hover:bg-primary text-white shadow-2xl"
                >
                  <Play className="w-10 h-10 ml-1" />
                </Button>
              </motion.div>
            </div>
          )}
        </div>
        
        {title && (
          <div className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-t border-primary/20">
            <h3 className="text-xl font-bold text-center">{title}</h3>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

