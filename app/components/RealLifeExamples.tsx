"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Image as ImageIcon, ShoppingCart, Users, FileText, MapPin, Heart } from 'lucide-react';

export function RealLifeExamples() {
  const examples = [
    {
      icon: ImageIcon,
      title: "Photo Organization",
      description: "Group similar photos together - family photos, vacation pictures, or pet photos automatically sorted.",
      color: "bg-blue-500",
    },
    {
      icon: ShoppingCart,
      title: "Customer Segmentation",
      description: "Identify groups of customers with similar buying habits to create targeted marketing campaigns.",
      color: "bg-green-500",
    },
    {
      icon: Users,
      title: "Social Network Analysis",
      description: "Find communities of people with similar interests, connections, or behaviors in social networks.",
      color: "bg-purple-500",
    },
    {
      icon: FileText,
      title: "Document Clustering",
      description: "Organize documents by topic - group research papers, news articles, or emails by their content.",
      color: "bg-orange-500",
    },
    {
      icon: MapPin,
      title: "Location Analysis",
      description: "Identify hotspots or regions with similar characteristics - crime zones, business districts, or residential areas.",
      color: "bg-red-500",
    },
    {
      icon: Heart,
      title: "Medical Diagnosis",
      description: "Group patients with similar symptoms or conditions to identify patterns and improve treatment.",
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3">Real-Life Applications</h2>
        <p className="text-lg text-muted-foreground">
          Hierarchical clustering is used in many everyday applications
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((example, idx) => {
          const IconComponent = example.icon;
          return (
            <Card key={idx} className="border-2 border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className={`${example.color} w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{example.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {example.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

