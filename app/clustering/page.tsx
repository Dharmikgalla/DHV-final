"use client";

import dynamic from "next/dynamic";
import { queryClient } from "../lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const ClusteringPage = dynamic(() => import("../ClusteringPage"), { ssr: false });

export default function ClusteringRoute() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ClusteringPage />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

