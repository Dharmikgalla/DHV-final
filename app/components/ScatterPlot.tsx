import { useEffect, useRef, useState } from 'react';
import { DataPoint, ClusterInfo } from '@shared/schema';
import { User, MapPin, ShoppingBag } from 'lucide-react';

interface ScatterPlotProps {
  dataPoints: DataPoint[];
  clusters: ClusterInfo[];
  connections: Array<[number, number]>;
  datasetType: 'medical' | 'crime' | 'customer';
  xLabel: string;
  yLabel: string;
  xRange?: [number, number];
  yRange?: [number, number];
  onAddPoint?: (x: number, y: number) => void;
  onPointHover?: (point: DataPoint | null) => void;
  onClusterHover?: (cluster: ClusterInfo | null) => void;
  addMode: boolean;
}

export function ScatterPlot({
  dataPoints,
  clusters,
  connections,
  datasetType,
  xLabel,
  yLabel,
  xRange,
  yRange,
  onAddPoint,
  onPointHover,
  onClusterHover,
  addMode,
}: ScatterPlotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [hoveredCluster, setHoveredCluster] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const padding = { top: 40, right: 40, bottom: 60, left: 70 };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: Math.max(500, width * 0.75) });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const getScales = () => {
    if (xRange && yRange) {
      // Use provided ranges
      return {
        xMin: xRange[0],
        xMax: xRange[1],
        yMin: yRange[0],
        yMax: yRange[1],
      };
    }

    // Fallback to data-based scaling
    const xValues = dataPoints.map(p => p.x);
    const yValues = dataPoints.map(p => p.y);

    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    const xRange = xMax - xMin || 1;
    const yRange = yMax - yMin || 1;

    return {
      xMin: xMin - xRange * 0.1,
      xMax: xMax + xRange * 0.1,
      yMin: yMin - yRange * 0.1,
      yMax: yMax + yRange * 0.1,
    };
  };

  const scaleX = (x: number) => {
    const scales = getScales();
    return padding.left + ((x - scales.xMin) / (scales.xMax - scales.xMin)) * (dimensions.width - padding.left - padding.right);
  };

  const scaleY = (y: number) => {
    const scales = getScales();
    return dimensions.height - padding.bottom - ((y - scales.yMin) / (scales.yMax - scales.yMin)) * (dimensions.height - padding.top - padding.bottom);
  };

  const inverseScaleX = (px: number) => {
    const scales = getScales();
    return scales.xMin + ((px - padding.left) / (dimensions.width - padding.left - padding.right)) * (scales.xMax - scales.xMin);
  };

  const inverseScaleY = (px: number) => {
    const scales = getScales();
    return scales.yMin + ((dimensions.height - padding.bottom - px) / (dimensions.height - padding.top - padding.bottom)) * (scales.yMax - scales.yMin);
  };

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

    // Draw grid
    ctx.strokeStyle = 'hsl(var(--border))';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;

    for (let i = 0; i <= 10; i++) {
      const x = padding.left + (i / 10) * (dimensions.width - padding.left - padding.right);
      const y = padding.top + (i / 10) * (dimensions.height - padding.top - padding.bottom);

      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, dimensions.height - padding.bottom);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(dimensions.width - padding.right, y);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // Draw clusters
    clusters.forEach((cluster, idx) => {
      if (cluster.pointIndices.length === 0) return;

      const points = cluster.pointIndices.map(i => dataPoints[i]).filter(Boolean);
      if (points.length === 0) return;

      const xs = points.map(p => scaleX(p.x));
      const ys = points.map(p => scaleY(p.y));

      const centerX = xs.reduce((a, b) => a + b, 0) / xs.length;
      const centerY = ys.reduce((a, b) => a + b, 0) / ys.length;

      const maxDist = Math.max(
        ...xs.map((x, i) => Math.sqrt((x - centerX) ** 2 + (ys[i] - centerY) ** 2))
      );

      const radius = maxDist + 30;

      ctx.fillStyle = cluster.color.replace('hsl', 'hsla').replace(')', ', 0.08)');
      ctx.strokeStyle = cluster.color;
      ctx.lineWidth = 3;

      if (hoveredCluster === idx) {
        ctx.fillStyle = cluster.color.replace('hsl', 'hsla').replace(')', ', 0.15)');
        ctx.shadowColor = cluster.color;
        ctx.shadowBlur = 15;
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0;
    });

    // Draw connections
    ctx.strokeStyle = 'hsl(var(--primary))';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.setLineDash([4, 4]);

    connections.forEach(([i, j]) => {
      const p1 = dataPoints[i];
      const p2 = dataPoints[j];
      if (!p1 || !p2) return;

      ctx.beginPath();
      ctx.moveTo(scaleX(p1.x), scaleY(p1.y));
      ctx.lineTo(scaleX(p2.x), scaleY(p2.y));
      ctx.stroke();
    });

    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // Draw axes
    ctx.strokeStyle = 'hsl(var(--foreground))';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, dimensions.height - padding.bottom);
    ctx.lineTo(dimensions.width - padding.right, dimensions.height - padding.bottom);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = 'hsl(var(--foreground))';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(xLabel, dimensions.width / 2, dimensions.height - 20);

    ctx.save();
    ctx.translate(20, dimensions.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();

  }, [dataPoints, clusters, connections, dimensions, xLabel, yLabel, hoveredCluster]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    // Check for hovered points
    let foundPoint = false;
    for (let i = 0; i < dataPoints.length; i++) {
      const px = scaleX(dataPoints[i].x);
      const py = scaleY(dataPoints[i].y);
      const dist = Math.sqrt((px - x) ** 2 + (py - y) ** 2);

      if (dist < 15) {
        setHoveredPoint(i);
        onPointHover?.(dataPoints[i]);
        foundPoint = true;
        break;
      }
    }

    if (!foundPoint) {
      setHoveredPoint(null);
      onPointHover?.(null);
    }

    // Check for hovered clusters
    let foundCluster = false;
    clusters.forEach((cluster, idx) => {
      if (cluster.pointIndices.length === 0) return;

      const points = cluster.pointIndices.map(i => dataPoints[i]).filter(Boolean);
      if (points.length === 0) return;

      const xs = points.map(p => scaleX(p.x));
      const ys = points.map(p => scaleY(p.y));

      const centerX = xs.reduce((a, b) => a + b, 0) / xs.length;
      const centerY = ys.reduce((a, b) => a + b, 0) / ys.length;

      const maxDist = Math.max(
        ...xs.map((x, i) => Math.sqrt((x - centerX) ** 2 + (ys[i] - centerY) ** 2))
      );

      const radius = maxDist + 30;
      const dist = Math.sqrt((centerX - x) ** 2 + (centerY - y) ** 2);

      if (dist < radius && !foundPoint) {
        setHoveredCluster(idx);
        onClusterHover?.(cluster);
        foundCluster = true;
      }
    });

    if (!foundCluster) {
      setHoveredCluster(null);
      if (!foundPoint) onClusterHover?.(null);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!addMode || !onAddPoint) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check if clicked within plot area
    if (
      clickX >= padding.left &&
      clickX <= dimensions.width - padding.right &&
      clickY >= padding.top &&
      clickY <= dimensions.height - padding.bottom
    ) {
      const dataX = inverseScaleX(clickX);
      const dataY = inverseScaleY(clickY);
      onAddPoint(dataX, dataY);
    }
  };

  const IconComponent = datasetType === 'medical' ? User : datasetType === 'crime' ? MapPin : ShoppingBag;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-card rounded-md border border-card-border overflow-visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHoveredPoint(null);
        setHoveredCluster(null);
        onPointHover?.(null);
        onClusterHover?.(null);
      }}
      onClick={handleClick}
      style={{ cursor: addMode ? 'crosshair' : 'default' }}
    >
      <canvas ref={canvasRef} className="w-full" />

      {/* SVG overlay for icons */}
      <svg
        className="absolute top-0 left-0 pointer-events-none"
        width={dimensions.width}
        height={dimensions.height}
        style={{ overflow: 'visible' }}
      >
        {dataPoints.map((point, idx) => {
          const x = scaleX(point.x);
          const y = scaleY(point.y);
          const isHovered = hoveredPoint === idx;
          const cluster = clusters.find(c => c.pointIndices.includes(idx));

          return (
            <g key={point.id} transform={`translate(${x}, ${y})`}>
              {isHovered && (
                <circle
                  r={18}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  opacity={0.5}
                  className="animate-pulse"
                />
              )}
              {point.isNew && (
                <circle
                  r={20}
                  fill="none"
                  stroke="hsl(var(--chart-5))"
                  strokeWidth={3}
                  opacity={0.7}
                  className="animate-pulse"
                />
              )}
              <foreignObject x={-12} y={-12} width={24} height={24}>
                <IconComponent
                  className={`w-6 h-6 transition-all ${isHovered ? 'scale-125' : ''}`}
                  style={{
                    color: cluster ? cluster.color : 'hsl(var(--foreground))',
                    filter: isHovered ? 'drop-shadow(0 0 4px currentColor)' : 'none',
                  }}
                />
              </foreignObject>
            </g>
          );
        })}

        {/* Ghost icon for add mode */}
        {addMode && mousePos.x > padding.left && mousePos.x < dimensions.width - padding.right &&
          mousePos.y > padding.top && mousePos.y < dimensions.height - padding.bottom && (
          <g transform={`translate(${mousePos.x}, ${mousePos.y})`} opacity={0.5}>
            <foreignObject x={-12} y={-12} width={24} height={24}>
              <IconComponent className="w-6 h-6" style={{ color: 'hsl(var(--primary))' }} />
            </foreignObject>
          </g>
        )}
      </svg>
    </div>
  );
}
