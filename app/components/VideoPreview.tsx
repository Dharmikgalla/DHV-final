"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VideoModal } from './VideoModal';

interface VideoPreviewProps {
  videoPath: string;
  title: string;
  thumbnail?: string;
}

export function VideoPreview({ videoPath, title, thumbnail }: VideoPreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-center">
        <Card className="border-2 border-primary/30 shadow-lg overflow-hidden cursor-pointer hover:shadow-xl hover:border-primary/60 transition-all group max-w-md" onClick={() => setIsModalOpen(true)}>
          <CardContent className="p-0 relative">
            <div className="relative w-full aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
              {thumbnail ? (
                <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10" />
              )}
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <motion.div
                  initial={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    size="lg"
                    className="rounded-full w-28 h-28 bg-primary hover:bg-primary/90 text-white shadow-2xl border-4 border-white/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsModalOpen(true);
                    }}
                  >
                    <Play className="w-14 h-14 ml-1" />
                  </Button>
                </motion.div>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
                <p className="text-white text-sm font-medium">▶ Click here to watch the video</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <VideoModal
        videoPath={videoPath}
        title={title}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

