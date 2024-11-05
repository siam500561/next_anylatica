import { useEffect } from "react";

interface AnalyticsProps {
  apiKey: string;
  apiUrl: string;
}

export function Analytics({ apiKey, apiUrl }: AnalyticsProps) {
  useEffect(() => {
    const storageKey = `visitor_id_${apiKey}`;

    const generateVisitorId = () =>
      "visitor_" + Math.random().toString(36).substr(2, 9);

    const getCookie = (name: string): string | null => {
      if (typeof document === "undefined") return null;
      const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
      );
      return match ? match[2] : null;
    };

    const storeVisitorId = (visitorId: string) => {
      if (typeof window === "undefined") return;
      localStorage.setItem(storageKey, visitorId);
      const oneYear = 365 * 24 * 60 * 60 * 1000;
      const expires = new Date(Date.now() + oneYear).toUTCString();
      document.cookie = `${storageKey}=${visitorId};expires=${expires};path=/`;
    };

    const getVisitorId = () => {
      if (typeof window === "undefined") return null;

      let visitorId = localStorage.getItem(storageKey);
      if (!visitorId) visitorId = getCookie(storageKey);
      if (!visitorId) {
        visitorId = generateVisitorId();
        storeVisitorId(visitorId);
      }
      return visitorId;
    };

    const trackPageView = async () => {
      try {
        const visitorId = getVisitorId();
        if (!visitorId) return;

        const userAgent =
          typeof window !== "undefined" ? window.navigator.userAgent : "Server";

        const response = await fetch(
          `${apiUrl.replace(/\/+$/, "")}/api/track`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              visitorId,
              userAgent,
              isNewVisitor: !localStorage.getItem(`visited_${apiKey}`),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to track page view");
        }

        localStorage.setItem(`visited_${apiKey}`, "true");
        return await response.json();
      } catch (error: unknown) {
        console.error("Error tracking page view:", error);
        throw error;
      }
    };

    trackPageView();
  }, [apiKey, apiUrl]);

  return null;
}
