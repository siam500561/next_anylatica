"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, Copy, Globe, GripVertical } from "lucide-react";
import { Button } from "./ui/button";
import { ViewsChart } from "./ViewsChart";
import { WebsiteContextMenu } from "./WebsiteContextMenu";
import WebsiteStats from "./WebsiteStats";

interface Website {
  _id: string;
  name: string;
  url: string;
  apiKey: string;
  views: number;
  createdAt: number;
  position: number;
}

interface SortableWebsiteCardProps {
  website: Website;
  copiedKey: string | null;
  onCopyKey: (apiKey: string, e: React.MouseEvent) => void;
}

export function SortableWebsiteCard({
  website,
  copiedKey,
  onCopyKey,
}: SortableWebsiteCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: website._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <WebsiteContextMenu website={website}>
      <div
        ref={setNodeRef}
        style={style}
        className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-default"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className="p-2 bg-gray-50 rounded-lg cursor-grab active:cursor-grabbing"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Globe className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{website.name}</h3>
                  <a
                    href={website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {website.url}
                  </a>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-gray-600">API Key</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => onCopyKey(website.apiKey, e)}
                  className="flex items-center gap-1 h-7"
                >
                  {copiedKey === website.apiKey ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span className="text-xs">
                    {copiedKey === website.apiKey ? "Copied!" : "Copy"}
                  </span>
                </Button>
              </div>
              <code className="text-sm font-mono bg-gray-100 p-1 rounded block overflow-x-auto">
                {website.apiKey}
              </code>
            </div>

            <WebsiteStats websiteId={website._id} />
          </div>

          <div className="h-[200px] md:h-full">
            <ViewsChart websiteId={website._id} />
          </div>
        </div>
      </div>
    </WebsiteContextMenu>
  );
}
