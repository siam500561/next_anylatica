import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

export class Analytics {
  private apiKey: string;
  private convex: ConvexHttpClient;
  private storageKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    this.storageKey = `visitor_id_${apiKey}`; // Unique storage key per website
  }

  private generateVisitorId() {
    return "visitor_" + Math.random().toString(36).substr(2, 9);
  }

  private getVisitorId() {
    if (typeof window === "undefined") return this.generateVisitorId();

    // Try to get from localStorage first
    let visitorId = localStorage.getItem(this.storageKey);

    if (!visitorId) {
      // If not in localStorage, try to get from cookie
      visitorId = this.getCookie(this.storageKey);
    }

    if (!visitorId) {
      // If no ID exists anywhere, generate a new one
      visitorId = this.generateVisitorId();
      // Store in both localStorage and cookie for persistence
      this.storeVisitorId(visitorId);
    }

    return visitorId;
  }

  private getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  private storeVisitorId(visitorId: string) {
    // Store in localStorage
    localStorage.setItem(this.storageKey, visitorId);

    // Store in cookie with 1-year expiry
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    const expires = new Date(Date.now() + oneYear).toUTCString();
    document.cookie = `${this.storageKey}=${visitorId};expires=${expires};path=/`;
  }

  async trackPageView() {
    try {
      const visitorId = this.getVisitorId();
      const userAgent =
        typeof window !== "undefined" ? window.navigator.userAgent : "Server";

      const result = await this.convex.mutation(api.visitors.trackVisit, {
        apiKey: this.apiKey,
        visitorId,
        userAgent,
      });
      return result;
    } catch (error: unknown) {
      // Don't throw error if no websites exist yet
      if (
        error instanceof Error &&
        error.message === "No websites registered yet"
      ) {
        console.log("No websites registered yet");
        return null;
      }
      console.error("Error tracking page view:", error);
      throw error;
    }
  }
}
