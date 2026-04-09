import React from "react";
import { History as HistoryIcon, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModelPreset } from "@/src/lib/gemini";

export interface HistoryItem {
  id: string;
  image: string;
  prompt: string;
  preset: ModelPreset;
  timestamp: number;
}

interface HistoryProps {
  items: HistoryItem[];
  onDelete: (id: string) => void;
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
}

export function History({ items, onDelete, onClear, onSelect }: HistoryProps) {
  if (items.length === 0) return null;

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <HistoryIcon className="w-5 h-5" />
          Recent Prompts
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-destructive">
          Clear All
        </Button>
      </CardHeader>
      <CardContent className="px-0">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative bg-card border rounded-xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => onSelect(item)}
              >
                <div className="flex gap-4 p-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    <img src={item.image} alt="History" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {item.preset}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 italic">
                      "{item.prompt}"
                    </p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
