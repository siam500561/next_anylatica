"use client";

import { WebsitesList } from "@/components/WebsitesList";
import { api } from "@/convex/_generated/api";
import { Analytics } from "@/lib/analytics";
import { useQuery } from "convex/react";
import { useEffect } from "react";

const analytics = new Analytics("wa_6H5Te6SAzKORuOlzTK4ryQV1uV8tNi3F");

export default function Home() {
  const websites = useQuery(api.websites.list);

  useEffect(() => {
    analytics
      .trackPageView()
      .then(() => console.log("Page view tracked"))
      .catch((error: Error) =>
        console.error("Error tracking page view:", error)
      );
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Web Analytics Dashboard</h1>
      <div className="grid grid-cols-1 gap-8">
        {/* <AddWebsiteForm /> */}
        <WebsitesList websites={websites || []} />
      </div>
    </main>
  );
}
