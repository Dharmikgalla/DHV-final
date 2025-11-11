import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Plus, ArrowDownUp, ArrowUpDown, User, MapPin, ShoppingBag, ChevronLeft, ChevronRight, LayoutGrid, LayoutList } from 'lucide-react';
import { DATASET_CONFIGS } from '@/lib/datasets';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ControlPanelProps {
  dataset: 'medical' | 'crime' | 'customer';
  algorithm: 'agglomerative' | 'divisive';
  xAxis: string;
  yAxis: string;
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  addMode: boolean;
  onDatasetChange: (dataset: 'medical' | 'crime' | 'customer') => void;
  onAlgorithmChange: (algorithm: 'agglomerative' | 'divisive') => void;
  onXAxisChange: (axis: string) => void;
  onYAxisChange: (axis: string) => void;
  onPlayPause: () => void;
  onReset: () => void;
  onAddModeToggle: () => void;
  onStepChange: (step: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  layout?: 'side-by-side' | 'top-bottom';
  onLayoutChange?: (layout: 'side-by-side' | 'top-bottom') => void;
}

export function ControlPanel({
  dataset,
  algorithm,
  xAxis,
  yAxis,
  isPlaying,
  currentStep,
  totalSteps,
  addMode,
  onDatasetChange,
  onAlgorithmChange,
  onXAxisChange,
  onYAxisChange,
  onPlayPause,
  onReset,
  onAddModeToggle,
  onStepChange,
  onPrevious,
  onNext,
  layout = 'side-by-side',
  onLayoutChange,
}: ControlPanelProps) {
  const config = DATASET_CONFIGS[dataset];

  return (
    <div className="sticky top-0 z-40 bg-background/98 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto max-w-screen-2xl px-4 py-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Left: Dataset, Algorithm, and Axis Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Dataset</label>
              <Select value={dataset} onValueChange={onDatasetChange}>
                <SelectTrigger className="w-56 h-10 shadow-sm border-border/60 hover:border-primary/40 transition-colors" data-testid="select-dataset">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical" data-testid="option-medical">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Medical Patients</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="crime" data-testid="option-crime">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Crime Sites</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="customer" data-testid="option-customer">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Customer Segmentation</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Algorithm</label>
              <Select value={algorithm} onValueChange={onAlgorithmChange}>
                <SelectTrigger className="w-64 h-10 shadow-sm border-border/60 hover:border-primary/40 transition-colors" data-testid="select-algorithm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agglomerative" data-testid="option-agglomerative">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4" />
                      <span>Agglomerative (Bottom-Up)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="divisive" data-testid="option-divisive">
                    <div className="flex items-center gap-2">
                      <ArrowDownUp className="w-4 h-4" />
                      <span>Divisive (Top-Down)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">X-Axis</label>
              <Select value={xAxis} onValueChange={onXAxisChange}>
                <SelectTrigger className="w-48 h-10 shadow-sm border-border/60 hover:border-primary/40 transition-colors" data-testid="select-x-axis">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {config.availableAxes?.map((axis) => (
                    <SelectItem key={axis.key} value={axis.key}>
                      {axis.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Y-Axis</label>
              <Select value={yAxis} onValueChange={onYAxisChange}>
                <SelectTrigger className="w-48 h-10 shadow-sm border-border/60 hover:border-primary/40 transition-colors" data-testid="select-y-axis">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {config.availableAxes?.map((axis) => (
                    <SelectItem key={axis.key} value={axis.key}>
                      {axis.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right: Playback Controls */}
          <div className="flex items-center gap-2">
            {/* Control Buttons Group */}
            <div className="flex items-center gap-1.5 bg-muted/30 rounded-lg p-1 border border-border/50">
              {onPrevious && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onPrevious}
                  disabled={currentStep === 0}
                  data-testid="button-previous"
                  className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-40"
                  title="Previous step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}

              <Button
                size="icon"
                variant="ghost"
                onClick={onPlayPause}
                data-testid="button-play-pause"
                className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>

              {onNext && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onNext}
                  disabled={currentStep >= totalSteps}
                  data-testid="button-next"
                  className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-40"
                  title="Next step"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            <Button
              size="icon"
              variant="outline"
              onClick={onReset}
              data-testid="button-reset"
              className="h-9 w-9 shadow-sm hover:shadow transition-all hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
              title="Reset to beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
              size="default"
              variant={addMode ? 'default' : 'outline'}
              onClick={onAddModeToggle}
              data-testid="button-add-mode"
              className="gap-2 h-9 shadow-sm hover:shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              {addMode ? 'Adding Point...' : 'Add Data Point'}
            </Button>

            {/* Layout Toggle */}
            {onLayoutChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 shadow-sm hover:shadow transition-all hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                    title="Change layout"
                  >
                    {layout === 'side-by-side' ? (
                      <LayoutGrid className="w-4 h-4" />
                    ) : (
                      <LayoutList className="w-4 h-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onLayoutChange('side-by-side')}
                    className={layout === 'side-by-side' ? 'bg-primary/10' : ''}
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Side by Side
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onLayoutChange('top-bottom')}
                    className={layout === 'top-bottom' ? 'bg-primary/10' : ''}
                  >
                    <LayoutList className="w-4 h-4 mr-2" />
                    Top & Bottom
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Badge variant="secondary" className="px-4 py-2 font-mono text-sm font-semibold shadow-sm border border-border/50" data-testid="text-step-counter">
              Step {currentStep} / {totalSteps}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        {totalSteps > 0 && (
          <div className="mt-1 pt-1.5 border-t border-border/50">
            <div className="relative w-full h-2.5 bg-muted/50 rounded-full overflow-hidden shadow-inner">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-3 gap-1">
              {Array.from({ length: Math.min(totalSteps, 10) }, (_, i) => {
                const step = Math.floor((i / 9) * (totalSteps - 1));
                return (
                  <button
                    key={i}
                    onClick={() => onStepChange(step)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 hover:scale-150 ${
                      currentStep >= step 
                        ? 'bg-primary shadow-sm scale-125 ring-2 ring-primary/30' 
                        : 'bg-muted-foreground/20 hover:bg-muted-foreground/40'
                    }`}
                    data-testid={`button-step-${step}`}
                    title={`Go to step ${step}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
