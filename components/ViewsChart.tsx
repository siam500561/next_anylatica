"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { format, subDays } from "date-fns";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ViewsChartProps {
  websiteId: string;
}

export function ViewsChart({ websiteId }: ViewsChartProps) {
  const viewsData = useQuery(api.websites.getDailyViews, { websiteId });

  if (!viewsData) {
    return (
      <div className="w-full h-full bg-gray-50 rounded-lg animate-pulse" />
    );
  }

  const data = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const formattedDate = format(date, "MMM dd");
    const views = viewsData[format(date, "yyyy-MM-dd")] || 0;
    return {
      date: formattedDate,
      views,
    };
  }).reverse();

  return (
    <div className="w-full h-full bg-white rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 0,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#888888"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            width={30}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#2563eb"
            fill="url(#colorViews)"
            strokeWidth={2}
            dot={false}
            animationDuration={1500}
          />
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
