import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    url: v.string(),
    views: v.number(),
    createdAt: v.number(),
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const websites = await ctx.db.query("websites").collect();
    const position = websites.length;

    // Use args.apiKey instead of generating a new one since it's provided

    return await ctx.db.insert("websites", {
      ...args,
      position,
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    const websites = await ctx.db.query("websites").collect();
    return websites.sort((a, b) => a.position - b.position);
  },
});

export const getByApiKey = query({
  args: { apiKey: v.string() },
  handler: async (ctx, args) => {
    const website = await ctx.db
      .query("websites")
      .filter((q) => q.eq(q.field("apiKey"), args.apiKey))
      .first();
    return website;
  },
});

export const getStats = query({
  args: { websiteId: v.id("websites") },
  handler: async (ctx, args) => {
    const website = await ctx.db.get(args.websiteId);

    // Return null if website doesn't exist instead of throwing an error
    if (!website) {
      return null;
    }
    const views = await ctx.db
      .query("visitors")
      .withIndex("by_website_visitor")
      .filter((q) => q.eq(q.field("websiteId"), args.websiteId))
      .collect();

    const uniqueVisitors = views.length;
    return {
      totalViews: views.length,
      uniqueVisitors,
    };
  },
});

export const getDailyViews = query({
  args: { websiteId: v.string() },
  handler: async (ctx, args) => {
    const visitors = await ctx.db
      .query("visitors")
      .withIndex("by_website_visitor")
      .filter((q) => q.eq(q.field("websiteId"), args.websiteId))
      .collect();

    // Group visitors by date
    const dailyViews: { [key: string]: number } = {};
    visitors.forEach((visitor) => {
      const date = new Date(visitor.timestamp).toISOString().split("T")[0];
      dailyViews[date] = (dailyViews[date] || 0) + 1;
    });

    return dailyViews;
  },
});

export const deleteWebsite = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    // Delete all associated visitors first
    const visitors = await ctx.db
      .query("visitors")
      .withIndex("by_website_visitor")
      .filter((q) => q.eq(q.field("websiteId"), args.id))
      .collect();

    for (const visitor of visitors) {
      await ctx.db.delete(visitor._id);
    }

    // Delete the website
    await ctx.db.delete(args.id as Id<"websites">);
  },
});

export const update = mutation({
  args: {
    id: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id as Id<"websites">, {
      name: args.name,
    });
  },
});

export const updatePosition = mutation({
  args: {
    id: v.string(),
    newPosition: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id as Id<"websites">, {
      position: args.newPosition,
    });
  },
});

export const updatePositions = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.string(),
        position: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const update of args.updates) {
      await ctx.db.patch(update.id as Id<"websites">, {
        position: update.position,
      });
    }
  },
});
