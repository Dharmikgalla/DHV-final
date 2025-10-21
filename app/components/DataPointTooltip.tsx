import { DataPoint } from '@shared/schema';
import { DATASET_CONFIGS } from '@/lib/datasets';
import { User, MapPin, ShoppingBag } from 'lucide-react';

interface DataPointTooltipProps {
  point: DataPoint;
  datasetType: 'medical' | 'crime' | 'customer';
  position: { x: number; y: number };
}

export function DataPointTooltip({ point, datasetType, position }: DataPointTooltipProps) {
  const config = DATASET_CONFIGS[datasetType];
  const IconComponent = datasetType === 'medical' ? User : datasetType === 'crime' ? MapPin : ShoppingBag;

  return (
    <div
      className="absolute z-50 bg-popover/95 backdrop-blur-sm border border-popover-border rounded-md shadow-xl p-3 pointer-events-none min-w-64"
      style={{
        left: `${position.x + 20}px`,
        top: `${position.y - 20}px`,
        transform: 'translateY(-100%)',
      }}
    >
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
        <IconComponent className="w-4 h-4 text-primary" />
        <span className="font-mono text-sm font-semibold">{point.id}</span>
      </div>

      <div className="space-y-1">
        {config.tooltipFields.map((field) => {
          const value = (point.data as any)[field.key];
          const displayValue = field.format ? field.format(value, point.data) : value;

          return (
            <div key={field.key} className="flex justify-between gap-4 text-xs">
              <span className="text-muted-foreground">{field.label}:</span>
              <span className="font-mono font-medium">{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
