import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const trackVisit = mutation({
  args: {
    apiKey: v.string(),
    visitorId: v.string(),
    userAgent: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the website by API key
    const website = await ctx.db
      .query("websites")
      .filter((q) => q.eq(q.field("apiKey"), args.apiKey))
      .first();

    if (!website) return;

    // Check if visitor already exists for this website
    const existingVisitor = await ctx.db
      .query("visitors")
      .withIndex("by_website_visitor", (q) =>
        q.eq("websiteId", website._id).eq("visitorId", args.visitorId)
      )
      .first();

    if (existingVisitor) {
      // Update the timestamp for the existing visitor
      await ctx.db.patch(existingVisitor._id, {
        timestamp: Date.now(),
      });
      return existingVisitor._id;
    }

    // Create new visitor if doesn't exist
    const visitorId = await ctx.db.insert("visitors", {
      visitorId: args.visitorId,
      userAgent: args.userAgent,
      timestamp: Date.now(),
      websiteId: website._id,
    });

    // Update the website's view count
    await ctx.db.patch(website._id, {
      views: (website.views || 0) + 1,
    });

    return visitorId;
  },
});
