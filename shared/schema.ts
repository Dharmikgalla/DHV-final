import { z } from "zod";

// Medical Patient Dataset
export const medicalPatientSchema = z.object({
  Patient_ID: z.string(),
  Age: z.number(),
  Temperature_F: z.number(),
  Blood_Pressure_Sys: z.number(),
  Blood_Pressure_Dia: z.number(),
  Sugar_Level_mg_dL: z.number(),
  Symptoms: z.string(),
});

export type MedicalPatient = z.infer<typeof medicalPatientSchema>;

// Crime Site Dataset
export const crimeSiteSchema = z.object({
  Crime_ID: z.string(),
  Latitude: z.number(),
  Longitude: z.number(),
  Crime_Type: z.string(),
  Time_of_Day: z.string(),
  Severity_Level: z.number(),
  Reported_By: z.string(),
});

export type CrimeSite = z.infer<typeof crimeSiteSchema>;

// Customer Segmentation Dataset
export const customerSchema = z.object({
  Customer_ID: z.string(),
  Age: z.number(),
  Annual_Income_kUSD: z.number(),
  Spending_Score: z.number(),
  Loyalty_Years: z.number(),
  Preferred_Category: z.string(),
});

export type Customer = z.infer<typeof customerSchema>;

// Generic Data Point for scatter plot
export interface DataPoint {
  id: string;
  x: number;
  y: number;
  data: MedicalPatient | CrimeSite | Customer;
  cluster?: number;
  isNew?: boolean;
}

// Clustering Step for animation
export interface ClusterStep {
  stepNumber: number;
  description: string;
  connectedPairs?: Array<[number, number]>; // indices of points being connected
  mergedClusters?: Array<number[]>; // arrays of point indices in each cluster
  dendrogramHeight?: number;
  action: 'connect' | 'merge' | 'complete';
}

// Cluster Info for tooltips
export interface ClusterInfo {
  id: number;
  pointIndices: number[];
  color: string;
  stats: Record<string, number>;
  diagnosis?: string;
  name?: string;
}

// Clustering Request/Response
export const clusterRequestSchema = z.object({
  dataset: z.enum(['medical', 'crime', 'customer']),
  algorithm: z.enum(['agglomerative', 'divisive']),
  dataPoints: z.array(z.object({
    x: z.number(),
    y: z.number(),
    data: z.any(),
  })),
  numClusters: z.number().optional(),
});

export type ClusterRequest = z.infer<typeof clusterRequestSchema>;

export const clusterResponseSchema = z.object({
  steps: z.array(z.any()),
  finalClusters: z.array(z.array(z.number())),
  dendrogram: z.any(),
});

export type ClusterResponse = z.infer<typeof clusterResponseSchema>;

// Dataset configuration
export interface DatasetConfig {
  id: 'medical' | 'crime' | 'customer';
  name: string;
  icon: string;
  xAxis: { label: string; key: string };
  yAxis: { label: string; key: string };
  availableAxes?: Array<{ label: string; key: string; range: [number, number] }>;
  tooltipFields: Array<{ label: string; key: string; format?: (val: number, data?: any) => string }>;
  clusterColors: string[];
  getDiagnosis?: (stats: Record<string, number>) => string;
  getStoryStep?: (step: number, algorithm: 'agglomerative' | 'divisive') => string;
}
