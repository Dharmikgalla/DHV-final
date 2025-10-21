import { ClusterInfo } from '@shared/schema';
import { DATASET_CONFIGS } from '@/lib/datasets';
import { Layers } from 'lucide-react';

interface ClusterTooltipProps {
  cluster: ClusterInfo;
  datasetType: 'medical' | 'crime' | 'customer';
  position: { x: number; y: number };
}

export function ClusterTooltip({ cluster, datasetType, position }: ClusterTooltipProps) {
  const config = DATASET_CONFIGS[datasetType];

  return (
    <div
      className="absolute z-50 bg-popover/95 backdrop-blur-sm border border-popover-border rounded-md shadow-xl p-4 pointer-events-none min-w-72"
      style={{
        left: `${position.x + 20}px`,
        top: `${position.y - 20}px`,
        transform: 'translateY(-100%)',
      }}
    >
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: cluster.color }}
        />
        <Layers className="w-4 h-4 text-primary" />
        <span className="font-semibold">Cluster {cluster.id + 1}</span>
        <span className="text-xs text-muted-foreground ml-auto">
          {cluster.pointIndices.length} {cluster.pointIndices.length === 1 ? 'point' : 'points'}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Average Statistics
        </h4>
        {Object.entries(cluster.stats).map(([key, value]) => (
          <div key={key} className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground capitalize">
              {key.replace(/_/g, ' ')}:
            </span>
            <span className="font-mono font-medium">{value.toFixed(1)}</span>
          </div>
        ))}
      </div>

      {cluster.diagnosis && (
        <div className="pt-3 border-t border-border">
          <p className="text-sm font-medium italic" style={{ color: cluster.color }}>
            {cluster.diagnosis}
          </p>
        </div>
      )}
    </div>
  );
}
