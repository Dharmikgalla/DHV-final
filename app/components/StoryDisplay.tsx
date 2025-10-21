import { DATASET_CONFIGS } from '@/lib/datasets';

interface StoryDisplayProps {
  dataset: 'medical' | 'crime' | 'customer';
  algorithm: 'agglomerative' | 'divisive';
  currentStep: number;
}

export function StoryDisplay({ dataset, algorithm, currentStep }: StoryDisplayProps) {
  const config = DATASET_CONFIGS[dataset];
  
  if (!config.getStoryStep) {
    return null;
  }

  const storyText = config.getStoryStep(currentStep, algorithm);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
            {currentStep + 1}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            {storyText}
          </p>
        </div>
      </div>
    </div>
  );
}
