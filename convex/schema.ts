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
  }),

  visitors: defineTable({
    visitorId: v.string(),
    userAgent: v.string(),
    timestamp: v.number(),
    websiteId: v.string(),
  })
    .index("by_website_visitor", ["websiteId", "visitorId"])
    .index("by_website_timestamp", ["websiteId", "timestamp"]),
});
