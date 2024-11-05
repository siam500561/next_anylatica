import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { generateApiKey } from "./utils";

export const create = mutation({
  args: {
    name: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const position = await ctx.db
      .query("websites")
      .collect()
      .then((websites) => websites.length);

    const website = await ctx.db.insert("websites", {
      name: args.name,
      url: args.url,
      apiKey: generateApiKey(),
      createdAt: Date.now(),
      views: 0,
      position,
    });

    return website;
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

    if (!website) {
      return null;
    }
    const views = await ctx.db
      .query("visitors")
      .withIndex("by_website")
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
  args: { websiteId: v.id("websites") },
  handler: async (ctx, args) => {
    const visitors = await ctx.db
      .query("visitors")
      .withIndex("by_website")
      .filter((q) => q.eq(q.field("websiteId"), args.websiteId))
      .collect();

    // Group visitors by date
    const dailyViews: { [key: string]: number } = {};
    visitors.forEach((visitor) => {
      const date = new Date(visitor.metadata.timestamp)
        .toISOString()
        .split("T")[0];
      dailyViews[date] = (dailyViews[date] || 0) + 1;
    });

    return dailyViews;
  },
});

export const deleteWebsite = mutation({
  args: { id: v.id("websites") },
  handler: async (ctx, args) => {
    // Delete all associated visitors first
    const visitors = await ctx.db
      .query("visitors")
      .withIndex("by_website")
      .filter((q) => q.eq(q.field("websiteId"), args.id))
      .collect();

    for (const visitor of visitors) {
      await ctx.db.delete(visitor._id);
    }

    // Delete the website
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("websites"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
    });
  },
});

export const updatePosition = mutation({
  args: {
    id: v.id("websites"),
    newPosition: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      position: args.newPosition,
    });
  },
});

export const updatePositions = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("websites"),
        position: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const update of args.updates) {
      await ctx.db.patch(update.id, {
        position: update.position,
      });
    }
  },
});
