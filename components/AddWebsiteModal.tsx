"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";

interface AddWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddWebsiteModal({ isOpen, onClose }: AddWebsiteModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const addWebsite = useMutation(api.websites.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addWebsite({
        name,
        url,
        views: 0,
        createdAt: Date.now(),
        apiKey: `key_${Math.random().toString(36).substring(2)}`,
      });
      setName("");
      setUrl("");
      onClose();
    } catch (error) {
      console.error("Error adding website:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Website</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Website Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Website"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              type="url"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Website</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
