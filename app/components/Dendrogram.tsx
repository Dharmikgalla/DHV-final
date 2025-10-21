import { useEffect, useRef, useState } from 'react';

interface DendrogramNode {
  left?: DendrogramNode;
  right?: DendrogramNode;
  height: number;
  label?: string;
  color?: string;
  indices?: number[];
}

interface DendrogramProps {
  tree: DendrogramNode | null;
  currentHeight: number;
  labels: string[];
  colors: string[];
  cutLine?: number;
  onCutLineChange?: (height: number) => void;
  currentStep: number;
  totalSteps: number;
  clusteringSteps: any[];
}

export function Dendrogram({ 
  tree, 
  currentHeight, 
  labels, 
  colors, 
  cutLine, 
  onCutLineChange,
  currentStep,
  totalSteps,
  clusteringSteps
}: DendrogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 600 });
  const [isDragging, setIsDragging] = useState(false);

  const padding = { top: 20, right: 20, bottom: 40, left: 80 };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Get all unique labels from the tree and ensure all input labels are included
    const allLabels = new Set<string>();
    const collectLabels = (node: DendrogramNode) => {
      if (node.label) {
        allLabels.add(node.label);
      }
      if (node.left) collectLabels(node.left);
      if (node.right) collectLabels(node.right);
    };
    
    if (tree) {
      collectLabels(tree);
    }
    
    // Add any missing labels
    labels.forEach(label => allLabels.add(label));
    
    const sortedLabels = Array.from(allLabels).sort();
    const leafSpacing = (dimensions.height - padding.top - padding.bottom) / Math.max(sortedLabels.length - 1, 1);

    // Create a map of label to y position
    const labelToY = new Map<string, number>();
    sortedLabels.forEach((label, idx) => {
      labelToY.set(label, padding.top + idx * leafSpacing);
    });

    const maxHeight = getMaxHeight(tree);
    const scaleX = (height: number) => {
      return padding.left + ((height / (maxHeight || 1)) * (dimensions.width - padding.left - padding.right));
    };

    // Draw leaf nodes and their horizontal lines
    sortedLabels.forEach((label, idx) => {
      const yPos = padding.top + idx * leafSpacing;
      
      // Draw label
      ctx.fillStyle = 'hsl(var(--foreground))';
      ctx.font = '12px JetBrains Mono';
      ctx.textAlign = 'right';
      ctx.fillText(label, padding.left - 10, yPos + 4);

      // Draw horizontal line to axis
      ctx.strokeStyle = 'hsl(var(--muted-foreground))';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding.left, yPos);
      ctx.lineTo(scaleX(0), yPos);
      ctx.stroke();

      // Draw node circle
      ctx.fillStyle = 'hsl(var(--foreground))';
      ctx.beginPath();
      ctx.arc(padding.left, yPos, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw progressive dendrogram based on current step
    if (tree && clusteringSteps.length > 0) {
      drawProgressiveDendrogram(ctx, tree, labelToY, scaleX, currentStep, clusteringSteps);
    }

    // Draw axis
    ctx.strokeStyle = 'hsl(var(--foreground))';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, dimensions.height - padding.bottom);
    ctx.stroke();

    // Draw axis label
    ctx.fillStyle = 'hsl(var(--foreground))';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Merge Distance', dimensions.width / 2, dimensions.height - 10);

    // Draw cut line
    const effectiveCutLine = cutLine !== undefined ? cutLine : (tree?.height || 0) * 0.6;
    const cutX = scaleX(effectiveCutLine);
    ctx.strokeStyle = 'hsl(var(--destructive))';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(cutX, padding.top);
    ctx.lineTo(cutX, dimensions.height - padding.bottom);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw cut line label
    ctx.fillStyle = 'hsl(var(--destructive))';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(`Cut: ${effectiveCutLine.toFixed(2)}`, cutX + 5, padding.top + 15);

  }, [tree, currentHeight, dimensions, labels, colors, cutLine, currentStep, totalSteps, clusteringSteps]);

  const drawProgressiveDendrogram = (
    ctx: CanvasRenderingContext2D, 
    node: DendrogramNode, 
    labelToY: Map<string, number>, 
    scaleX: (height: number) => number,
    currentStep: number,
    clusteringSteps: any[]
  ) => {
    if (!node) return;

    // If this is a leaf node, we already drew it
    if (node.label) return;

    // Draw children first
    if (node.left) {
      drawProgressiveDendrogram(ctx, node.left, labelToY, scaleX, currentStep, clusteringSteps);
    }
    if (node.right) {
      drawProgressiveDendrogram(ctx, node.right, labelToY, scaleX, currentStep, clusteringSteps);
    }

    // Only draw this merge if it has occurred by the current step
    const stepIndex = findStepForMerge(node, clusteringSteps);
    if (stepIndex !== -1 && stepIndex < currentStep) {
      const leftY = getNodeY(node.left, labelToY);
      const rightY = getNodeY(node.right, labelToY);
      const x = scaleX(node.height);
      const midY = (leftY + rightY) / 2;

      ctx.strokeStyle = 'hsl(var(--primary))';
      ctx.lineWidth = 2;

      // Draw vertical line connecting children
      ctx.beginPath();
      ctx.moveTo(x, leftY);
      ctx.lineTo(x, rightY);
      ctx.stroke();

      // Draw horizontal lines to children
      const childX = node.left ? scaleX(node.left.height) : padding.left;
      ctx.beginPath();
      ctx.moveTo(childX, leftY);
      ctx.lineTo(x, leftY);
      ctx.stroke();

      const childX2 = node.right ? scaleX(node.right.height) : padding.left;
      ctx.beginPath();
      ctx.moveTo(childX2, rightY);
      ctx.lineTo(x, rightY);
      ctx.stroke();

      // Draw merge node
      ctx.fillStyle = 'hsl(var(--primary))';
      ctx.beginPath();
      ctx.arc(x, midY, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const findStepForMerge = (node: DendrogramNode, clusteringSteps: any[]): number => {
    // Find which step corresponds to this merge
    for (let i = 0; i < clusteringSteps.length; i++) {
      const step = clusteringSteps[i];
      if (step.action === 'connect' || step.action === 'merge') {
        // Check if this step's merged cluster matches this node's indices
        if (node.indices && step.mergedCluster && 
            node.indices.length === step.mergedCluster.length &&
            node.indices.every(idx => step.mergedCluster.includes(idx))) {
          return i;
        }
      }
    }
    return -1;
  };

  const getNodeY = (node: DendrogramNode | undefined, labelToY: Map<string, number>): number => {
    if (!node) return padding.top;
    
    if (node.label) {
      return labelToY.get(node.label) || padding.top;
    }
    
    // For internal nodes, calculate the midpoint of their children
    const leftY = getNodeY(node.left, labelToY);
    const rightY = getNodeY(node.right, labelToY);
    return (leftY + rightY) / 2;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onCutLineChange || !tree) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const maxHeight = getMaxHeight(tree);
    const scaleX = (height: number) => {
      return padding.left + ((height / (maxHeight || 1)) * (dimensions.width - padding.left - padding.right));
    };
    
    // Convert mouse X to height value
    const height = ((x - padding.left) / (dimensions.width - padding.left - padding.right)) * maxHeight;
    onCutLineChange(Math.max(0, Math.min(maxHeight, height)));
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !onCutLineChange || !tree) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const maxHeight = getMaxHeight(tree);
    const height = ((x - padding.left) / (dimensions.width - padding.left - padding.right)) * maxHeight;
    onCutLineChange(Math.max(0, Math.min(maxHeight, height)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getMaxHeight = (node: DendrogramNode | null): number => {
    if (!node) return 0;
    if (!node.left && !node.right) return 0;
    const leftHeight = node.left ? getMaxHeight(node.left) : 0;
    const rightHeight = node.right ? getMaxHeight(node.right) : 0;
    return Math.max(node.height, leftHeight, rightHeight);
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-card rounded-md border border-card-border border-l-4 border-l-primary/30 overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold">Dendrogram Tree</h3>
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps} - Progressive clustering visualization
        </p>
      </div>
      <div className="p-4 h-full overflow-hidden">
        <div className="relative w-full h-full">
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full cursor-crosshair" 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/80 backdrop-blur-sm text-sm text-muted-foreground">
            Cut line at distance: {(cutLine !== undefined ? cutLine : (tree?.height || 0) * 0.6).toFixed(2)} - Click and drag on the dendrogram to adjust
          </div>
        </div>
      </div>
    </div>
  );
}
