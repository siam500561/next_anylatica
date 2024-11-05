"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SortableWebsiteCard } from "./SortableWebsiteCard";
import { Button } from "./ui/button";
import { WebsiteFormModal } from "./WebsiteFormModal";
import { WebsitesListSkeleton } from "./WebsitesListSkeleton";

interface WebsitesListProps {
  websites: Doc<"websites">[] | undefined;
  isLoading: boolean;
}

export function WebsitesList({
  websites: initialWebsites,
  isLoading,
}: WebsitesListProps) {
  const [websites, setWebsites] = useState<Doc<"websites">[] | undefined>(
    initialWebsites
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const updatePositions = useMutation(api.websites.updatePositions);

  // Update local state when props change
  useEffect(() => {
    setWebsites(initialWebsites);
  }, [initialWebsites]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Add a small threshold to prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const copyApiKey = (apiKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(apiKey);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !websites) return;

    if (active.id !== over.id) {
      const oldIndex = websites.findIndex((w) => w._id === active.id);
      const newIndex = websites.findIndex((w) => w._id === over.id);

      // Update local state immediately for smooth animation
      const newWebsites = arrayMove([...websites], oldIndex, newIndex);
      setWebsites(newWebsites);

      // Create updates for all affected websites
      const updates = newWebsites.map((website, index) => ({
        id: website._id,
        position: index,
      }));

      try {
        await updatePositions({ updates });
      } catch {
        // Revert to original state if update fails
        setWebsites(websites);
        toast.error("Failed to update positions");
      }
    }
  };

  if (isLoading) {
    return <WebsitesListSkeleton />;
  }

  if (!websites || websites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <h3 className="text-xl font-semibold mb-4">
          No websites registered yet
        </h3>
        <p className="text-gray-600 mb-6">
          Add your first website to start tracking visitors
        </p>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add Your First Website
        </Button>
        <WebsiteFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Websites</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Website
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <SortableContext
          items={websites.map((w) => w._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {websites.map((website) => (
              <SortableWebsiteCard
                key={website._id}
                website={website}
                copiedKey={copiedKey}
                onCopyKey={copyApiKey}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <WebsiteFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
