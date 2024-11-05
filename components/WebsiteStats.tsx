"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Eye, Users } from "lucide-react";

interface WebsiteStatsProps {
  websiteId: string;
}

export default function WebsiteStats({ websiteId }: WebsiteStatsProps) {
  const stats = useQuery(api.websites.getStats, {
    websiteId: websiteId as Id<"websites">,
  });

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-600">Total Views</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {stats.totalViews.toLocaleString()}
        </p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-600">Unique Visitors</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {stats.uniqueVisitors.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
