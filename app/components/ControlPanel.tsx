import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Plus, ArrowDownUp, ArrowUpDown, User, MapPin, ShoppingBag } from 'lucide-react';
import { DATASET_CONFIGS } from '@/lib/datasets';

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
}: ControlPanelProps) {
  const config = DATASET_CONFIGS[dataset];

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto max-w-screen-2xl px-6 py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left: Dataset, Algorithm, and Axis Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground font-medium">Dataset</label>
              <Select value={dataset} onValueChange={onDatasetChange}>
                <SelectTrigger className="w-56" data-testid="select-dataset">
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
              <label className="text-xs text-muted-foreground font-medium">Algorithm</label>
              <Select value={algorithm} onValueChange={onAlgorithmChange}>
                <SelectTrigger className="w-64" data-testid="select-algorithm">
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
              <label className="text-xs text-muted-foreground font-medium">X-Axis</label>
              <Select value={xAxis} onValueChange={onXAxisChange}>
                <SelectTrigger className="w-48" data-testid="select-x-axis">
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
              <label className="text-xs text-muted-foreground font-medium">Y-Axis</label>
              <Select value={yAxis} onValueChange={onYAxisChange}>
                <SelectTrigger className="w-48" data-testid="select-y-axis">
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
            <Button
              size="icon"
              variant="outline"
              onClick={onPlayPause}
              data-testid="button-play-pause"
              className="hover-elevate"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={onReset}
              data-testid="button-reset"
              className="hover-elevate"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
              size="default"
              variant={addMode ? 'default' : 'outline'}
              onClick={onAddModeToggle}
              data-testid="button-add-mode"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              {addMode ? 'Adding Point...' : 'Add Data Point'}
            </Button>

            <Badge variant="secondary" className="px-3 py-1.5 font-mono" data-testid="text-step-counter">
              Step {currentStep} / {totalSteps}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        {totalSteps > 0 && (
          <div className="mt-4">
            <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {Array.from({ length: Math.min(totalSteps, 10) }, (_, i) => {
                const step = Math.floor((i / 9) * (totalSteps - 1));
                return (
                  <button
                    key={i}
                    onClick={() => onStepChange(step)}
                    className={`w-2 h-2 rounded-full transition-all hover-elevate ${
                      currentStep >= step ? 'bg-primary scale-125' : 'bg-muted-foreground/30'
                    }`}
                    data-testid={`button-step-${step}`}
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
