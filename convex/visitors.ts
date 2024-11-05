import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const trackVisit = mutation({
  args: {
    apiKey: v.string(),
    visitorId: v.string(),
    userAgent: v.string(),
    metadata: v.object({
      timestamp: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // Find the website associated with this API key
    const website = await ctx.db
      .query("websites")
      .filter((q) => q.eq(q.field("apiKey"), args.apiKey))
      .first();

    if (!website) {
      throw new Error("No websites registered yet");
    }

    // Check if this visitor already exists for this website
    const existingVisitor = await ctx.db
      .query("visitors")
      .withIndex("by_visitor_website")
      .filter((q) =>
        q.and(
          q.eq(q.field("websiteId"), website._id),
          q.eq(q.field("visitorId"), args.visitorId)
        )
      )
      .first();

    if (existingVisitor) {
      // Update the existing visitor's last visit time
      await ctx.db.patch(existingVisitor._id, {
        lastVisit: new Date().toISOString(),
        userAgent: args.userAgent,
        metadata: {
          timestamp: args.metadata.timestamp,
        },
        visitCount: (existingVisitor.visitCount || 0) + 1,
      });
      return existingVisitor._id;
    }

    // Create a new visitor record
    const visitorId = await ctx.db.insert("visitors", {
      websiteId: website._id,
      visitorId: args.visitorId,
      userAgent: args.userAgent,
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      metadata: {
        timestamp: args.metadata.timestamp,
      },
      visitCount: 1,
    });

    // Increment the website's view count
    await ctx.db.patch(website._id, {
      views: (website.views || 0) + 1,
    });

    return visitorId;
  },
});
