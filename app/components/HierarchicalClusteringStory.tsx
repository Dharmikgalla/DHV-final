"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Play, Pause, Users, Apple, BookOpen, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AnimatedItem {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
  group: number;
}

export function HierarchicalClusteringStory() {
  const [currentStory, setCurrentStory] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  const stories = [
    {
      id: 0,
      title: "Organizing People at a Party",
      icon: Users,
      description: "Watch how we group people who are similar",
      items: [
        { id: '1', x: 50, y: 50, color: 'bg-blue-500', label: '👨', group: 0 },
        { id: '2', x: 150, y: 50, color: 'bg-blue-500', label: '👨', group: 0 },
        { id: '3', x: 250, y: 50, color: 'bg-pink-500', label: '👩', group: 1 },
        { id: '4', x: 350, y: 50, color: 'bg-pink-500', label: '👩', group: 1 },
        { id: '5', x: 450, y: 50, color: 'bg-green-500', label: '👴', group: 2 },
        { id: '6', x: 550, y: 50, color: 'bg-green-500', label: '👴', group: 2 },
      ],
      steps: [
        { step: 0, text: "Everyone is standing alone at the party" },
        { step: 1, text: "We find two people who look similar..." },
        { step: 2, text: "They move closer together and form a group!" },
        { step: 3, text: "We find more similar people..." },
        { step: 4, text: "They also form groups!" },
        { step: 5, text: "Now all similar people are grouped together!" },
      ],
    },
    {
      id: 1,
      title: "Sorting Fruits by Color",
      icon: Apple,
      description: "See how fruits naturally group by color",
      items: [
        { id: '1', x: 50, y: 50, color: 'bg-red-500', label: '🍎', group: 0 },
        { id: '2', x: 150, y: 50, color: 'bg-red-500', label: '🍎', group: 0 },
        { id: '3', x: 250, y: 50, color: 'bg-yellow-500', label: '🍌', group: 1 },
        { id: '4', x: 350, y: 50, color: 'bg-yellow-500', label: '🍌', group: 1 },
        { id: '5', x: 450, y: 50, color: 'bg-orange-500', label: '🍊', group: 2 },
        { id: '6', x: 550, y: 50, color: 'bg-orange-500', label: '🍊', group: 2 },
      ],
      steps: [
        { step: 0, text: "All fruits are mixed together" },
        { step: 1, text: "We notice red fruits are similar..." },
        { step: 2, text: "Red fruits group together!" },
        { step: 3, text: "Yellow fruits are also similar..." },
        { step: 4, text: "Yellow fruits form their own group!" },
        { step: 5, text: "Now fruits are organized by color!" },
      ],
    },
    {
      id: 2,
      title: "Organizing Books by Topic",
      icon: BookOpen,
      description: "Watch books find their similar topics",
      items: [
        { id: '1', x: 50, y: 50, color: 'bg-purple-500', label: '📚', group: 0 },
        { id: '2', x: 150, y: 50, color: 'bg-purple-500', label: '📚', group: 0 },
        { id: '3', x: 250, y: 50, color: 'bg-blue-500', label: '📖', group: 1 },
        { id: '4', x: 350, y: 50, color: 'bg-blue-500', label: '📖', group: 1 },
        { id: '5', x: 450, y: 50, color: 'bg-green-500', label: '📗', group: 2 },
        { id: '6', x: 550, y: 50, color: 'bg-green-500', label: '📗', group: 2 },
      ],
      steps: [
        { step: 0, text: "Books are scattered on a table" },
        { step: 1, text: "We see some books are about the same topic..." },
        { step: 2, text: "Similar books move together!" },
        { step: 3, text: "More books find their topics..." },
        { step: 4, text: "They also group together!" },
        { step: 5, text: "Books are now organized by topic!" },
      ],
    },
  ];

  const currentStoryData = stories[currentStory];
  const IconComponent = currentStoryData.icon;

  // Animation logic
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setAnimationStep((prev) => {
        if (prev >= currentStoryData.steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, currentStoryData.steps.length]);

  const handlePlay = () => {
    if (animationStep >= currentStoryData.steps.length - 1) {
      setAnimationStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStoryChange = (newStory: number) => {
    setCurrentStory(newStory);
    setAnimationStep(0);
    setIsPlaying(false);
  };

  // Calculate positions for items based on animation step
  const getItemPosition = (item: AnimatedItem, step: number) => {
    const groupItems = currentStoryData.items.filter(i => i.group === item.group);
    const groupIndex = groupItems.indexOf(item);
    const groupStart = item.group * 200 + 100;
    const targetX = groupStart + (groupIndex * 80);
    const targetY = 150;
    
    if (step === 0) {
      // Initial scattered positions
      return { x: item.x, y: item.y };
    } else if (step === item.group + 1) {
      // Items are moving to their group - show in transition
      const progress = 0.5; // Halfway to target
      return {
        x: item.x + (targetX - item.x) * progress,
        y: item.y + (targetY - item.y) * progress,
      };
    } else if (step > item.group + 1) {
      // Items are in their final grouped positions
      return { x: targetX, y: targetY };
    } else {
      // Items haven't started moving yet
      return { x: item.x, y: item.y };
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-card via-card to-primary/5 rounded-xl shadow-lg border border-border/50 overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Learn Hierarchical Clustering
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Watch simple animations to understand how it works
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            Story {currentStory + 1} / {stories.length}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        {/* Story Selector */}
        <div className="flex gap-2 mb-6 justify-center">
          {stories.map((story, idx) => {
            const StoryIcon = story.icon;
            return (
              <button
                key={idx}
                onClick={() => handleStoryChange(idx)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  currentStory === idx
                    ? 'border-primary bg-primary/10 scale-105'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <StoryIcon className={`w-6 h-6 ${currentStory === idx ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-xs font-medium ${currentStory === idx ? 'text-primary' : 'text-muted-foreground'}`}>
                  {story.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Current Story Title */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold mb-1 flex items-center justify-center gap-2">
            <IconComponent className="w-5 h-5 text-primary" />
            {currentStoryData.title}
          </h3>
          <p className="text-sm text-muted-foreground">{currentStoryData.description}</p>
        </div>

        {/* Animated Visualization */}
        <div className="bg-background/50 rounded-xl border border-border/50 p-8 mb-6 min-h-[300px] flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentStory}-${animationStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full relative"
              style={{ height: '300px' }}
            >
              {currentStoryData.items.map((item) => {
                const position = getItemPosition(item, animationStep);
                const isGrouped = animationStep > item.group + 1;
                const isMoving = animationStep === item.group + 1;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={false}
                    animate={{
                      x: position.x,
                      y: position.y,
                      scale: isGrouped ? 1.2 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 80,
                      damping: 12,
                    }}
                    className={`absolute ${item.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg border-2 border-white/50 ${
                      isMoving ? 'ring-4 ring-primary/50' : ''
                    }`}
                    style={{
                      left: 0,
                      top: 0,
                    }}
                  >
                    {item.label}
                    {isMoving && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Sparkles className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}

              {/* Draw group circles around clustered items */}
              {animationStep > 1 && currentStoryData.items.map((item) => {
                if (animationStep <= item.group + 1) return null;
                const groupItems = currentStoryData.items.filter(i => i.group === item.group);
                if (groupItems.indexOf(item) !== 0) return null; // Only draw circle from first item
                
                const position = getItemPosition(item, animationStep);
                const groupSize = groupItems.length;
                const circleRadius = groupSize * 45;
                
                return (
                  <motion.div
                    key={`circle-${item.group}`}
                    className="absolute border-4 border-primary/40 rounded-full pointer-events-none"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      left: position.x + 32 - circleRadius,
                      top: position.y + 32 - circleRadius,
                      width: circleRadius * 2,
                      height: circleRadius * 2,
                    }}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step Description */}
        <div className="bg-primary/10 rounded-lg p-4 mb-6 border border-primary/20">
          <motion.p
            key={animationStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-lg font-semibold text-foreground"
          >
            {currentStoryData.steps[animationStep]?.text || currentStoryData.steps[0].text}
          </motion.p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => handleStoryChange((currentStory - 1 + stories.length) % stories.length)}
            className="gap-2"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Previous Story
          </Button>

          <div className="flex items-center gap-4">
            <Button
              onClick={handlePlay}
              className="gap-2"
              size="lg"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Play Animation
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setAnimationStep(0)}
              disabled={animationStep === 0}
            >
              Reset
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => handleStoryChange((currentStory + 1) % stories.length)}
            className="gap-2"
          >
            Next Story
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {currentStoryData.steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setAnimationStep(idx);
                setIsPlaying(false);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === animationStep
                  ? 'bg-primary scale-125 ring-2 ring-primary/30'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
