import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { agglomerativeClustering, divisiveClustering } from "./clustering";
import { clusterRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Clustering endpoint
  app.post("/api/cluster", async (req, res) => {
    try {
      const validatedData = clusterRequestSchema.parse(req.body);
      const { algorithm, dataPoints } = validatedData;

      // Convert data points to the format expected by clustering algorithms
      const points = dataPoints.map((dp, idx) => ({
        id: dp.data?.Patient_ID || dp.data?.Crime_ID || dp.data?.Customer_ID || `Point${idx}`,
        x: dp.x,
        y: dp.y,
        data: dp.data,
      }));

      // Run the appropriate clustering algorithm
      let result;
      if (algorithm === 'agglomerative') {
        result = agglomerativeClustering(points);
      } else {
        result = divisiveClustering(points);
      }

      res.json({
        success: true,
        steps: result.steps,
        finalClusters: result.finalClusters,
        dendrogram: result.dendrogram,
      });
    } catch (error: any) {
      console.error('Clustering error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to perform clustering',
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
