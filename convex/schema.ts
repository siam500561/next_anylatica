import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  websites: defineTable({
    name: v.string(),
    url: v.string(),
    apiKey: v.string(),
    createdAt: v.number(),
    views: v.number(),
    position: v.number(),
  }).index("by_api_key", ["apiKey"]),

  visitors: defineTable({
    websiteId: v.id("websites"),
    visitorId: v.string(),
    userAgent: v.string(),
    firstVisit: v.string(),
    lastVisit: v.string(),
    visitCount: v.number(),
    metadata: v.object({
      timestamp: v.string(),
    }),
  })
    .index("by_website", ["websiteId"])
    .index("by_visitor_website", ["websiteId", "visitorId"]),
});
