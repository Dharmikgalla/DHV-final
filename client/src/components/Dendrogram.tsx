import { useEffect, useRef, useState } from 'react';

interface DendrogramNode {
  left?: DendrogramNode;
  right?: DendrogramNode;
  height: number;
  label?: string;
  color?: string;
}

interface DendrogramProps {
  tree: DendrogramNode | null;
  currentHeight: number;
  labels: string[];
  colors: string[];
}

export function Dendrogram({ tree, currentHeight, labels, colors }: DendrogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 600 });

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
    if (!canvas || !tree) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Calculate leaf positions
    const leaves: string[] = [];
    const getLeaves = (node: DendrogramNode): void => {
      if (node.label) {
        leaves.push(node.label);
      } else {
        if (node.left) getLeaves(node.left);
        if (node.right) getLeaves(node.right);
      }
    };
    getLeaves(tree);

    const maxHeight = getMaxHeight(tree);
    const leafSpacing = (dimensions.height - padding.top - padding.bottom) / Math.max(leaves.length - 1, 1);

    const scaleX = (height: number) => {
      return padding.left + ((height / (maxHeight || 1)) * (dimensions.width - padding.left - padding.right));
    };

    let leafIndex = 0;
    const drawNode = (node: DendrogramNode, y: number): number => {
      if (node.label) {
        // Leaf node
        const yPos = padding.top + leafIndex * leafSpacing;
        leafIndex++;

        // Draw label
        ctx.fillStyle = node.color || 'hsl(var(--foreground))';
        ctx.font = '12px JetBrains Mono';
        ctx.textAlign = 'right';
        ctx.fillText(node.label, padding.left - 10, yPos + 4);

        // Draw horizontal line to axis
        ctx.strokeStyle = node.color || 'hsl(var(--muted-foreground))';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding.left, yPos);
        ctx.lineTo(scaleX(0), yPos);
        ctx.stroke();

        // Draw node circle
        ctx.fillStyle = node.color || 'hsl(var(--foreground))';
        ctx.beginPath();
        ctx.arc(padding.left, yPos, 3, 0, Math.PI * 2);
        ctx.fill();

        return yPos;
      }

      // Internal node
      const leftY = node.left ? drawNode(node.left, y) : y;
      const rightY = node.right ? drawNode(node.right, y + 1) : y;

      const midY = (leftY + rightY) / 2;
      const x = scaleX(node.height);

      // Only draw if this merge has occurred based on currentHeight
      if (node.height <= currentHeight) {
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

      return midY;
    };

    drawNode(tree, 0);

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

  }, [tree, currentHeight, dimensions, labels, colors]);

  const getMaxHeight = (node: DendrogramNode): number => {
    if (!node.left && !node.right) return 0;
    const leftHeight = node.left ? getMaxHeight(node.left) : 0;
    const rightHeight = node.right ? getMaxHeight(node.right) : 0;
    return Math.max(node.height, leftHeight, rightHeight);
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-card rounded-md border border-card-border border-l-4 border-l-primary/30">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold">Dendrogram Tree</h3>
        <p className="text-sm text-muted-foreground">Visual hierarchy of cluster merges</p>
      </div>
      <div className="p-4">
        <canvas ref={canvasRef} className="w-full" />
      </div>
    </div>
  );
}
