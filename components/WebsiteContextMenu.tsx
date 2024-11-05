"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { WebsiteFormModal } from "./WebsiteFormModal";

interface WebsiteContextMenuProps {
  children: React.ReactNode;
  website: {
    _id: string;
    name: string;
    url: string;
  };
}

export function WebsiteContextMenu({
  children,
  website,
}: WebsiteContextMenuProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteWebsite = useMutation(api.websites.deleteWebsite);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteWebsite({ id: website._id as Id<"websites"> });
      toast.success("Website deleted successfully");
      setShowDeleteAlert(false);
    } catch {
      toast.error("Failed to delete website");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger className="block" asChild>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem
            onSelect={() => setShowEditModal(true)}
            className="cursor-pointer"
          >
            Edit
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={() => setShowDeleteAlert(true)}
            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {website.name} and remove all
              associated analytics data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <WebsiteFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        website={website}
      />
    </>
  );
}
