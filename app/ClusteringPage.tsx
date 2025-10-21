import { useState, useEffect, useRef } from 'react';
import { ScatterPlot } from '@/components/ScatterPlot';
import { Dendrogram } from '@/components/Dendrogram';
import { DataPointTooltip } from '@/components/DataPointTooltip';
import { ClusterTooltip } from '@/components/ClusterTooltip';
import { ControlPanel } from '@/components/ControlPanel';
import { StoryDisplay } from '@/components/StoryDisplay';
import { convertToDataPoints, convertToDataPointsWithAxes, DATASET_CONFIGS } from '@/lib/datasets';
import { DataPoint, ClusterInfo } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Layers, MousePointer2 } from 'lucide-react';

export default function ClusteringPage() {
  const [dataset, setDataset] = useState<'medical' | 'crime' | 'customer'>('medical');
  const [algorithm, setAlgorithm] = useState<'agglomerative' | 'divisive'>('agglomerative');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [clusters, setClusters] = useState<ClusterInfo[]>([]);
  const [connections, setConnections] = useState<Array<[number, number]>>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [hoveredCluster, setHoveredCluster] = useState<ClusterInfo | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dendrogramTree, setDendrogramTree] = useState<any>(null);
  const [currentHeight, setCurrentHeight] = useState(0);
  const [clusteringSteps, setClusteringSteps] = useState<any[]>([]);
  const [finalClusters, setFinalClusters] = useState<number[][]>([]);
  const [cutLine, setCutLine] = useState<number | undefined>(undefined);

  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const config = DATASET_CONFIGS[dataset];

  // Initialize axes when dataset changes
  useEffect(() => {
    if (config.availableAxes && config.availableAxes.length > 0) {
      if (!xAxis || !config.availableAxes.find(axis => axis.key === xAxis)) {
        setXAxis(config.xAxis.key);
      }
      if (!yAxis || !config.availableAxes.find(axis => axis.key === yAxis)) {
        setYAxis(config.yAxis.key);
      }
    }
  }, [dataset, config, xAxis, yAxis]);

  // Clustering mutation
  const clusterMutation = useMutation({
    mutationFn: async (data: { dataset: string; algorithm: string; dataPoints: any[] }) => {
      const response = await apiRequest('POST', '/api/cluster', data);
      return await response.json();
    },
    onSuccess: (data: any) => {
      setClusteringSteps(data.steps || []);
      setFinalClusters(data.finalClusters || []);
      setDendrogramTree(data.dendrogram);
      // Exclude the final "complete" step from total steps for animation
      const animationSteps = Math.max(0, (data.steps?.length || 1) - 1);
      setTotalSteps(animationSteps);
      setCurrentStep(0);
    },
    onError: (error: any) => {
      toast({
        title: 'Clustering Error',
        description: error.message || 'Failed to perform clustering',
        variant: 'destructive',
      });
    },
  });

  // Initialize data and run clustering when dataset, algorithm, or axes change
  useEffect(() => {
    if (!xAxis || !yAxis) return;
    
    const points = convertToDataPointsWithAxes(dataset, xAxis, yAxis);
    setDataPoints(points);
    setCurrentStep(0);
    setClusters([]);
    setConnections([]);
    setDendrogramTree(null);
    setCurrentHeight(0);
    setIsPlaying(false);
    setCutLine(undefined);

    // Run clustering
    clusterMutation.mutate({
      dataset,
      algorithm,
      dataPoints: points.map(p => ({ x: p.x, y: p.y, data: p.data })),
    });
  }, [dataset, algorithm, xAxis, yAxis]);

  // Update visualization based on current step
  useEffect(() => {
    if (dataPoints.length === 0 || clusteringSteps.length === 0) return;

    const updateVisualization = () => {
      if (currentStep === 0) {
        setClusters([]);
        setConnections([]);
        setCurrentHeight(0);
        return;
      }

      const step = clusteringSteps[Math.min(currentStep - 1, clusteringSteps.length - 1)];
      if (!step) return;

      // Update connections
      const newConnections: Array<[number, number]> = [];
      for (let i = 0; i < currentStep && i < clusteringSteps.length; i++) {
        const s = clusteringSteps[i];
        if (s.action === 'connect' || s.action === 'merge') {
          // Add connection between first points of each cluster
          if (s.cluster1.length > 0 && s.cluster2.length > 0) {
            newConnections.push([s.cluster1[0], s.cluster2[0]]);
          }
        }
      }
      setConnections(newConnections);

      // Update clusters based on final clusters
      if (finalClusters.length > 0) {
        const newClusters: ClusterInfo[] = finalClusters.map((indices, idx) => {
          const clusterPoints = indices.map(i => dataPoints[i]).filter(Boolean);
          const stats: Record<string, number> = {};

          // Calculate average stats
          config.tooltipFields.forEach((field) => {
            const values = clusterPoints.map(p => (p.data as any)[field.key]).filter(v => typeof v === 'number');
            if (values.length > 0) {
              stats[field.key] = values.reduce((a, b) => a + b, 0) / values.length;
            }
          });

          const diagnosis = config.getDiagnosis?.(stats);

          return {
            id: idx,
            pointIndices: indices,
            color: config.clusterColors[idx % config.clusterColors.length],
            stats,
            diagnosis,
          };
        });

        setClusters(newClusters);
      }

      setCurrentHeight(step.distance || 0);
    };

    updateVisualization();
  }, [currentStep, dataPoints, clusteringSteps, finalClusters, config]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && currentStep < totalSteps) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= totalSteps) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, currentStep, totalSteps]);

  const handlePlayPause = () => {
    if (currentStep >= totalSteps) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setClusters([]);
    setConnections([]);
    setCurrentHeight(0);
  };

  const handleAddPoint = (x: number, y: number) => {
    const newId = `NEW${dataPoints.length + 1}`;
    
    // Create a new data point based on dataset type
    let newData: any;
    if (dataset === 'medical') {
      newData = {
        Patient_ID: newId,
        Age: Math.round(Math.random() * 40 + 20),
        Temperature_F: y,
        Blood_Pressure_Sys: x,
        Blood_Pressure_Dia: Math.round(x * 0.6),
        Sugar_Level_mg_dL: Math.round(Math.random() * 100 + 80),
        Symptoms: 'Newly added patient',
      };
    } else if (dataset === 'crime') {
      newData = {
        Crime_ID: newId,
        Latitude: y,
        Longitude: x,
        Crime_Type: 'Unknown',
        Time_of_Day: 'Unknown',
        Severity_Level: Math.round(Math.random() * 5 + 1),
        Reported_By: 'System',
      };
    } else {
      newData = {
        Customer_ID: newId,
        Age: Math.round(Math.random() * 40 + 20),
        Annual_Income_kUSD: x,
        Spending_Score: y,
        Loyalty_Years: Math.round(Math.random() * 5 + 1),
        Preferred_Category: 'Unknown',
      };
    }

    const newPoint: DataPoint = {
      id: newId,
      x,
      y,
      data: newData,
      isNew: true,
    };

    const updatedPoints = [...dataPoints, newPoint];
    setDataPoints(updatedPoints);
    setAddMode(false);
    setCurrentStep(0);

    // Re-run clustering with new point
    clusterMutation.mutate({
      dataset,
      algorithm,
      dataPoints: updatedPoints.map(p => ({ x: p.x, y: p.y, data: p.data })),
    });

    toast({
      title: 'Data Point Added',
      description: `New ${dataset} data point has been added. Re-clustering...`,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="min-h-screen bg-background" onMouseMove={handleMouseMove}>
      <ControlPanel
        dataset={dataset}
        algorithm={algorithm}
        xAxis={xAxis}
        yAxis={yAxis}
        isPlaying={isPlaying}
        currentStep={currentStep}
        totalSteps={totalSteps}
        addMode={addMode}
        onDatasetChange={setDataset}
        onAlgorithmChange={setAlgorithm}
        onXAxisChange={setXAxis}
        onYAxisChange={setYAxis}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        onAddModeToggle={() => setAddMode(!addMode)}
        onStepChange={setCurrentStep}
      />

      <div className="container mx-auto max-w-screen-2xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Interactive Hierarchical Clustering
          </h1>
          <p className="text-lg text-muted-foreground">
            Learn machine learning clustering algorithms through visual storytelling
          </p>
        </div>

        {/* Loading State */}
        {clusterMutation.isPending && (
          <div className="flex items-center justify-center gap-3 p-8 bg-card rounded-md border border-card-border mb-6">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-lg font-medium">Computing clusters...</span>
          </div>
        )}

        {/* Story Display */}
        <StoryDisplay 
          dataset={dataset} 
          algorithm={algorithm} 
          currentStep={currentStep} 
        />

        {/* Main Visualization Area */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6">
          {/* Scatter Plot */}
          <div className="relative">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-1">{config.name}</h2>
              <p className="text-sm text-muted-foreground">
                {addMode ? 'Click anywhere on the plot to add a new data point' : 'Watch clusters form step-by-step'}
              </p>
            </div>

            {/* Add Mode Instructions */}
            {addMode && (
              <div className="mb-4 p-4 bg-primary/10 border border-primary/30 rounded-md">
                <div className="flex items-start gap-3">
                  <MousePointer2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Add Data Point Mode Active</h4>
                    <p className="text-sm text-muted-foreground">
                      Click anywhere on the scatter plot below to add a new {dataset} data point. 
                      The point will be automatically created with appropriate attributes and clustering will be recalculated.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <ScatterPlot
              dataPoints={dataPoints}
              clusters={clusters}
              connections={connections}
              datasetType={dataset}
              xLabel={config.availableAxes?.find(axis => axis.key === xAxis)?.label || config.xAxis.label}
              yLabel={config.availableAxes?.find(axis => axis.key === yAxis)?.label || config.yAxis.label}
              xRange={config.availableAxes?.find(axis => axis.key === xAxis)?.range}
              yRange={config.availableAxes?.find(axis => axis.key === yAxis)?.range}
              onAddPoint={handleAddPoint}
              onPointHover={setHoveredPoint}
              onClusterHover={setHoveredCluster}
              addMode={addMode}
            />

            {/* Tooltips */}
            {hoveredPoint && (
              <DataPointTooltip
                point={hoveredPoint}
                datasetType={dataset}
                position={mousePos}
              />
            )}

            {hoveredCluster && (
              <ClusterTooltip
                cluster={hoveredCluster}
                datasetType={dataset}
                position={mousePos}
              />
            )}
          </div>

          {/* Dendrogram */}
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-1">Dendrogram</h2>
              <p className="text-sm text-muted-foreground">
                Hierarchical tree showing cluster relationships
              </p>
            </div>

            <div className="h-[600px]">
              <Dendrogram
                tree={dendrogramTree}
                currentHeight={currentHeight}
                labels={dataPoints.map(p => p.id)}
                colors={dataPoints.map((_, idx) => {
                  const cluster = clusters.find(c => c.pointIndices.includes(idx));
                  return cluster?.color || 'hsl(var(--foreground))';
                })}
                cutLine={cutLine}
                onCutLineChange={setCutLine}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
