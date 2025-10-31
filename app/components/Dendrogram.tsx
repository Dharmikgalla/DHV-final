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

  const padding = { top: 50, right: 100, bottom: 60, left: 120 };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Use actual canvas container dimensions (excluding padding and borders)
        setDimensions({ 
          width: Math.max(rect.width - 16, 500), // Account for padding
          height: Math.max(rect.height - 100, 500) // Account for header
        });
      }
    };

    updateDimensions();
    // Small delay to ensure container has rendered
    const timer = setTimeout(updateDimensions, 100);
    const timer2 = setTimeout(updateDimensions, 500); // Extra delay for layout
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [labels.length]); // Re-calculate when number of labels changes

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

    // Get labels in dendrogram order (left-to-right traversal for better clustering visualization)
    const orderedLabels: string[] = [];
    
    const collectLabelsInOrder = (node: DendrogramNode) => {
      if (!node) return;
      
      // Leaf node - add its label
      if (node.label) {
        orderedLabels.push(node.label);
        return;
      }
      
      // Internal node - traverse left then right
      if (node.left) collectLabelsInOrder(node.left);
      if (node.right) collectLabelsInOrder(node.right);
    };
    
    if (tree) {
      collectLabelsInOrder(tree);
    }
    
    // Ensure all input labels are included (in case some are missing from tree)
    const labelsSet = new Set(orderedLabels);
    const missingLabels = labels.filter(label => !labelsSet.has(label)).sort();
    const sortedLabels = [...orderedLabels, ...missingLabels];
    
    // Calculate optimal spacing for labels to fit within container
    const availableHeight = dimensions.height - padding.top - padding.bottom;
    const minSpacing = 35; // Increased from 20 to 35 for better visibility
    const maxSpacing = 80; // Increased from 50 to 80 for generous spacing
    const calculatedSpacing = Math.max(sortedLabels.length - 1, 1) > 0 
      ? availableHeight / Math.max(sortedLabels.length - 1, 1)
      : availableHeight;
    const leafSpacing = Math.max(minSpacing, Math.min(maxSpacing, calculatedSpacing));

    // Create a map of label to y position - ensure they fit within bounds
    const labelToY = new Map<string, number>();
    const totalHeight = (sortedLabels.length - 1) * leafSpacing;
    const startY = padding.top + Math.max(0, (availableHeight - totalHeight) / 2);
    
    sortedLabels.forEach((label, idx) => {
      const yPos = startY + idx * leafSpacing;
      // Clamp within bounds
      const clampedY = Math.max(padding.top, Math.min(dimensions.height - padding.bottom, yPos));
      labelToY.set(label, clampedY);
    });

    const maxHeight = getMaxHeight(tree);
    const scaleX = (height: number) => {
      // Ensure we don't exceed the right boundary
      const availableWidth = dimensions.width - padding.left - padding.right;
      const scaledValue = (height / (maxHeight || 1)) * availableWidth;
      return padding.left + Math.min(scaledValue, availableWidth);
    };

    // Draw leaf nodes and their horizontal lines
    sortedLabels.forEach((label) => {
      const yPos = labelToY.get(label);
      if (yPos === undefined) return;
      
      // Draw label with better visibility
      ctx.fillStyle = 'hsl(var(--foreground))';
      ctx.font = '12px JetBrains Mono';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, padding.left - 12, yPos);

      // Draw horizontal line to axis
      ctx.strokeStyle = 'hsl(var(--border))';
      ctx.lineWidth = 1;
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
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Merge Distance', dimensions.width / 2, dimensions.height - 5);

    // Draw cut line (ensure it stays within bounds)
    const effectiveCutLine = cutLine !== undefined ? cutLine : (tree?.height || 0) * 0.6;
    const cutX = Math.min(scaleX(effectiveCutLine), dimensions.width - padding.right);
    ctx.strokeStyle = 'hsl(var(--destructive))';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(cutX, padding.top);
    ctx.lineTo(cutX, dimensions.height - padding.bottom);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw cut line label (ensure it doesn't overflow)
    ctx.fillStyle = 'hsl(var(--destructive))';
    ctx.font = 'bold 11px Inter';
    ctx.textAlign = 'left';
    const labelX = Math.min(cutX + 5, dimensions.width - padding.right - 60);
    ctx.fillText(`Cut: ${effectiveCutLine.toFixed(2)}`, labelX, padding.top + 15);

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
    <div ref={containerRef} className="w-full h-full overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-border flex-shrink-0 bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Dendrogram Tree</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Step {currentStep} of {totalSteps} - Progressive clustering visualization
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{labels.length}</span> data points
          </div>
        </div>
      </div>
      <div className="flex-1 p-8 min-h-0 overflow-hidden bg-background">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full cursor-crosshair block" 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </div>
  );
}
