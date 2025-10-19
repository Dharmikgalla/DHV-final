interface Point {
  id: string;
  x: number;
  y: number;
  data: any;
}

interface Cluster {
  points: number[];
  center: { x: number; y: number };
}

interface MergeStep {
  stepNumber: number;
  description: string;
  cluster1: number[];
  cluster2: number[];
  mergedCluster: number[];
  distance: number;
  action: 'connect' | 'merge' | 'complete';
}

interface DendrogramNode {
  left?: DendrogramNode;
  right?: DendrogramNode;
  height: number;
  label?: string;
  indices?: number[];
}

// Calculate Euclidean distance between two points
export function euclideanDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// Calculate distance between two clusters (average linkage)
function clusterDistance(c1: Cluster, c2: Cluster, points: Point[]): number {
  let totalDistance = 0;
  let count = 0;

  for (const i of c1.points) {
    for (const j of c2.points) {
      if (points[i] && points[j]) {
        totalDistance += euclideanDistance(points[i], points[j]);
        count++;
      }
    }
  }

  return count > 0 ? totalDistance / count : Infinity;
}

// Get cluster center
function getClusterCenter(cluster: Cluster, points: Point[]): { x: number; y: number } {
  let sumX = 0;
  let sumY = 0;
  let count = 0;

  for (const idx of cluster.points) {
    if (points[idx]) {
      sumX += points[idx].x;
      sumY += points[idx].y;
      count++;
    }
  }

  return count > 0 ? { x: sumX / count, y: sumY / count } : { x: 0, y: 0 };
}

// Agglomerative (Bottom-Up) Hierarchical Clustering
export function agglomerativeClustering(points: Point[]) {
  const steps: MergeStep[] = [];
  const dendrogramNodes: DendrogramNode[] = points.map((p, idx) => ({
    height: 0,
    label: p.id,
    indices: [idx],
  }));

  // Initialize: each point is its own cluster
  let clusters: Cluster[] = points.map((p, idx) => ({
    points: [idx],
    center: { x: p.x, y: p.y },
  }));

  let stepNumber = 0;

  // Merge until we have one cluster
  while (clusters.length > 1) {
    // Find the two closest clusters
    let minDistance = Infinity;
    let mergeI = -1;
    let mergeJ = -1;

    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const dist = clusterDistance(clusters[i], clusters[j], points);
        if (dist < minDistance) {
          minDistance = dist;
          mergeI = i;
          mergeJ = j;
        }
      }
    }

    if (mergeI === -1 || mergeJ === -1) break;

    const cluster1 = clusters[mergeI];
    const cluster2 = clusters[mergeJ];

    // Merge the clusters
    const mergedPoints = [...cluster1.points, ...cluster2.points];
    const mergedCluster: Cluster = {
      points: mergedPoints,
      center: { x: 0, y: 0 },
    };
    mergedCluster.center = getClusterCenter(mergedCluster, points);

    // Create dendrogram node for this merge
    const newNode: DendrogramNode = {
      left: dendrogramNodes[mergeI],
      right: dendrogramNodes[mergeJ],
      height: minDistance,
      indices: mergedPoints,
    };

    // Record this step
    const action = cluster1.points.length === 1 && cluster2.points.length === 1 ? 'connect' : 'merge';
    
    steps.push({
      stepNumber: stepNumber++,
      description: action === 'connect' 
        ? `Connecting ${points[cluster1.points[0]]?.id} and ${points[cluster2.points[0]]?.id} (distance: ${minDistance.toFixed(2)})`
        : `Merging cluster of ${cluster1.points.length} with cluster of ${cluster2.points.length} (distance: ${minDistance.toFixed(2)})`,
      cluster1: cluster1.points,
      cluster2: cluster2.points,
      mergedCluster: mergedPoints,
      distance: minDistance,
      action,
    });

    // Update clusters array
    clusters = clusters.filter((_, idx) => idx !== mergeI && idx !== mergeJ);
    clusters.push(mergedCluster);

    // Update dendrogram nodes
    dendrogramNodes[mergeI] = newNode;
    dendrogramNodes.splice(mergeJ, 1);
  }

  steps.push({
    stepNumber: stepNumber++,
    description: 'Clustering complete',
    cluster1: [],
    cluster2: [],
    mergedCluster: clusters[0]?.points || [],
    distance: 0,
    action: 'complete',
  });

  return {
    steps,
    dendrogram: dendrogramNodes[0] || null,
    finalClusters: getFinalClusters(steps, points.length, 3), // Get 3-4 final clusters
  };
}

// Divisive (Top-Down) Hierarchical Clustering
export function divisiveClustering(points: Point[]) {
  const steps: MergeStep[] = [];
  
  // Start with all points in one cluster
  let clusters: Cluster[] = [{
    points: Array.from({ length: points.length }, (_, i) => i),
    center: { x: 0, y: 0 },
  }];
  clusters[0].center = getClusterCenter(clusters[0], points);

  let stepNumber = 0;

  // Divide until each cluster has reasonable size
  while (clusters.length < Math.min(points.length, 4)) {
    // Find the largest cluster to split
    let maxSize = 0;
    let splitIdx = 0;

    clusters.forEach((cluster, idx) => {
      if (cluster.points.length > maxSize) {
        maxSize = cluster.points.length;
        splitIdx = idx;
      }
    });

    if (clusters[splitIdx].points.length <= 1) break;

    // Split using k-means (k=2) on this cluster
    const clusterToSplit = clusters[splitIdx];
    const { cluster1, cluster2 } = splitCluster(clusterToSplit, points);

    if (cluster1.points.length === 0 || cluster2.points.length === 0) break;

    steps.push({
      stepNumber: stepNumber++,
      description: `Dividing cluster of ${clusterToSplit.points.length} into ${cluster1.points.length} and ${cluster2.points.length}`,
      cluster1: cluster1.points,
      cluster2: cluster2.points,
      mergedCluster: clusterToSplit.points,
      distance: euclideanDistance(cluster1.center, cluster2.center),
      action: 'merge',
    });

    // Replace the split cluster with two new clusters
    clusters.splice(splitIdx, 1, cluster1, cluster2);
  }

  steps.push({
    stepNumber: stepNumber++,
    description: 'Clustering complete',
    cluster1: [],
    cluster2: [],
    mergedCluster: [],
    distance: 0,
    action: 'complete',
  });

  return {
    steps,
    dendrogram: null, // Divisive dendrograms are more complex to build
    finalClusters: clusters.map(c => c.points),
  };
}

// Split a cluster into two using k-means (k=2)
function splitCluster(cluster: Cluster, points: Point[]): { cluster1: Cluster; cluster2: Cluster } {
  if (cluster.points.length <= 1) {
    return {
      cluster1: cluster,
      cluster2: { points: [], center: { x: 0, y: 0 } },
    };
  }

  // Initialize two centroids randomly from cluster points
  const indices = cluster.points;
  const c1Idx = indices[0];
  const c2Idx = indices[Math.floor(indices.length / 2)];

  let centroid1 = { ...points[c1Idx] };
  let centroid2 = { ...points[c2Idx] };

  let assignment: number[] = new Array(points.length).fill(0);
  let changed = true;
  let iterations = 0;

  // Run k-means for a few iterations
  while (changed && iterations < 10) {
    changed = false;
    iterations++;

    // Assign points to nearest centroid
    for (const idx of indices) {
      if (!points[idx]) continue;
      
      const dist1 = euclideanDistance(points[idx], centroid1);
      const dist2 = euclideanDistance(points[idx], centroid2);
      const newAssignment = dist1 < dist2 ? 0 : 1;

      if (assignment[idx] !== newAssignment) {
        assignment[idx] = newAssignment;
        changed = true;
      }
    }

    // Update centroids
    const group1 = indices.filter(idx => assignment[idx] === 0);
    const group2 = indices.filter(idx => assignment[idx] === 1);

    if (group1.length > 0) {
      centroid1 = {
        x: group1.reduce((sum, idx) => sum + points[idx].x, 0) / group1.length,
        y: group1.reduce((sum, idx) => sum + points[idx].y, 0) / group1.length,
        id: '',
        data: null,
      };
    }

    if (group2.length > 0) {
      centroid2 = {
        x: group2.reduce((sum, idx) => sum + points[idx].x, 0) / group2.length,
        y: group2.reduce((sum, idx) => sum + points[idx].y, 0) / group2.length,
        id: '',
        data: null,
      };
    }
  }

  const group1 = indices.filter(idx => assignment[idx] === 0);
  const group2 = indices.filter(idx => assignment[idx] === 1);

  return {
    cluster1: {
      points: group1,
      center: centroid1,
    },
    cluster2: {
      points: group2,
      center: centroid2,
    },
  };
}

// Get final clusters from steps
function getFinalClusters(steps: MergeStep[], numPoints: number, targetClusters: number): number[][] {
  if (steps.length === 0) {
    return [Array.from({ length: numPoints }, (_, i) => i)];
  }

  // Get clusters at a specific step that gives us close to targetClusters
  const targetStep = Math.max(0, steps.length - targetClusters - 1);
  
  // Track which points belong to which cluster
  const pointToCluster = new Map<number, number>();
  const clusters = new Map<number, Set<number>>();

  // Initialize each point as its own cluster
  for (let i = 0; i < numPoints; i++) {
    pointToCluster.set(i, i);
    clusters.set(i, new Set([i]));
  }

  // Apply merges up to targetStep
  for (let i = 0; i < Math.min(targetStep, steps.length); i++) {
    const step = steps[i];
    if (step.action === 'complete') continue;

    const cluster1Id = pointToCluster.get(step.cluster1[0]);
    const cluster2Id = pointToCluster.get(step.cluster2[0]);

    if (cluster1Id === undefined || cluster2Id === undefined) continue;

    const cluster1Points = clusters.get(cluster1Id);
    const cluster2Points = clusters.get(cluster2Id);

    if (!cluster1Points || !cluster2Points) continue;

    // Merge cluster2 into cluster1
    cluster2Points.forEach(point => {
      cluster1Points.add(point);
      pointToCluster.set(point, cluster1Id);
    });

    clusters.delete(cluster2Id);
  }

  // Convert to array format
  return Array.from(clusters.values()).map(cluster => Array.from(cluster));
}
