import { NextRequest, NextResponse } from "next/server";
import { clusterRequestSchema } from "@shared/schema";
import { agglomerativeClustering, divisiveClustering } from "../../lib/clustering";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));
    
    const { algorithm, dataPoints } = clusterRequestSchema.parse(body);
    console.log(`Algorithm: ${algorithm}, Data points: ${dataPoints.length}`);

    const points = dataPoints.map((dp: any, idx: number) => ({
      id: dp.data?.Patient_ID || dp.data?.Crime_ID || dp.data?.Customer_ID || `Point${idx}`,
      x: dp.x,
      y: dp.y,
      data: dp.data,
    }));

    console.log('Converted points:', points.length);

    const result = algorithm === "agglomerative"
      ? agglomerativeClustering(points)
      : divisiveClustering(points);

    console.log('Clustering completed successfully');

    return NextResponse.json({
      success: true,
      steps: result.steps,
      finalClusters: result.finalClusters,
      dendrogram: result.dendrogram,
    });
  } catch (error: any) {
    console.error('Clustering error:', error);
    console.error('Error stack:', error?.stack);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to perform clustering", details: error?.stack },
      { status: 500 },
    );
  }
}

