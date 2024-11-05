"use client";

import { WebsitesList } from "@/components/WebsitesList";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Home() {
  const websites = useQuery(api.websites.list);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Web Analytics Dashboard</h1>
      <div className="grid grid-cols-1 gap-8">
        <WebsitesList
          isLoading={websites === undefined}
          websites={websites || []}
        />
      </div>
    </main>
  );
}
