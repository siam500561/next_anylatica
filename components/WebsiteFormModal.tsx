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
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface WebsiteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  website?: {
    _id: string;
    name: string;
    url: string;
  };
}

export function WebsiteFormModal({
  isOpen,
  onClose,
  website,
}: WebsiteFormModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createWebsite = useMutation(api.websites.create);
  const updateWebsite = useMutation(api.websites.update);

  const isEditing = !!website;

  useEffect(() => {
    if (website) {
      setName(website.name);
      setUrl(website.url);
    } else {
      setName("");
      setUrl("");
    }
  }, [website, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await updateWebsite({
          id: website._id as Id<"websites">,
          name,
        });
        toast.success("Website updated successfully");
      } else {
        await createWebsite({
          name,
          url,
        });
        toast.success("Website created successfully");
      }
      onClose();
    } catch {
      toast.error(
        isEditing ? "Failed to update website" : "Failed to create website"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Website" : "Add New Website"}
          </DialogTitle>
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
              disabled={isLoading}
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
              disabled={isEditing || isLoading}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update"
                  : "Add Website"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
