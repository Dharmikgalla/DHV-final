"use client";

import { ArrowRight, BarChart3, PlayCircle, Video } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RealLifeExamples } from '@/components/RealLifeExamples';
import { VideoModal } from '@/components/VideoModal';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function HomePage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-background">
          {/* Header */}
          <div className="w-full bg-gradient-to-br from-card via-card to-primary/5 border-b border-border/50 shadow-sm">
            <div className="container mx-auto max-w-screen-2xl px-6 py-8">
              <h1 className="text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Interactive Hierarchical Clustering
              </h1>
              <p className="text-lg text-muted-foreground font-medium">
                Learn Hierarchical clustering algorithms through visualization
              </p>
            </div>
          </div>

          <div className="container mx-auto max-w-screen-2xl px-6 py-8">
            {/* Explanation Section */}
            <div className="mb-12">
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold mb-4">What is Hierarchical Clustering?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-lg leading-relaxed">
                  <p className="text-foreground">
                    It's a way to organize things by putting similar items together, and then grouping those groups into bigger groups. 
                    Like organizing a messy room - you group similar items, then put those groups into boxes, and boxes into sections.
                  </p>
                  
                  <p className="text-foreground">
                    The process starts with individual items and gradually connects them based on how similar they are. 
                    You can stop at any point to see how many groups you have, making it flexible for different needs.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Video Access Section */}
            <div className="mb-12">
              <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold mb-3">Watch a Visual Explanation</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      Learn hierarchical clustering through a simple, animated video explanation
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={() => setIsVideoModalOpen(true)}
                      className="gap-3 text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
                    >
                      <PlayCircle className="w-6 h-6" />
                      Watch Video Explanation
                      <Video className="w-6 h-6" />
                    </Button>
                  </div>
                  
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Click the button above to open the video in full screen
                  </p>
                </CardContent>
              </Card>

              <VideoModal
                videoPath="/clustering-explained-simply.mp4"
                title="Clustering Explained Simply"
                isOpen={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
              />
            </div>

            {/* Real-Life Examples */}
            <div className="mb-12">
              <RealLifeExamples />
            </div>

            {/* Call to Action - Navigate to Clustering Page */}
            <div className="mb-8">
              <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 overflow-hidden">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-3xl font-bold mb-2">
                    Ready to Explore?
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Click below to start the interactive clustering visualization
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                  <Link href="/clustering">
                    <Button size="lg" className="gap-3 text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all">
                      <BarChart3 className="w-6 h-6" />
                      Start Clustering Visualization
                      <ArrowRight className="w-6 h-6" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

