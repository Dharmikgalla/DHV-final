import { NextRequest, NextResponse } from "next/server";
import { clusterRequestSchema } from "@shared/schema";
import { agglomerativeClustering, divisiveClustering } from "../../lib/clustering";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { algorithm, dataPoints } = clusterRequestSchema.parse(body);

    const points = dataPoints.map((dp: any, idx: number) => ({
      id: dp.data?.Patient_ID || dp.data?.Crime_ID || dp.data?.Customer_ID || `Point${idx}`,
      x: dp.x,
      y: dp.y,
      data: dp.data,
    }));

    const result = algorithm === "agglomerative"
      ? agglomerativeClustering(points)
      : divisiveClustering(points);

    return NextResponse.json({
      success: true,
      steps: result.steps,
      finalClusters: result.finalClusters,
      dendrogram: result.dendrogram,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to perform clustering" },
      { status: 400 },
    );
  }
}

