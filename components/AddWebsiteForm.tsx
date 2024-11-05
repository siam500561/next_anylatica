"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";

export function AddWebsiteForm() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const createWebsite = useMutation(api.websites.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createWebsite({ name, url });
    setName("");
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Add New Website</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Website Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Website URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Website
        </button>
      </div>
    </form>
  );
}
