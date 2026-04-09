import React, { useState } from "react";
import { Copy, Check, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface PromptOutputProps {
  prompt: string | null;
  isLoading: boolean;
  onRegenerate: () => void;
}

export function PromptOutput({ prompt, isLoading, onRegenerate }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success("Prompt copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!prompt && !isLoading) return null;

  return (
    <Card className="border-2 border-primary/10 shadow-lg overflow-hidden">
      <CardHeader className="bg-muted/30 pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Generated Prompt
        </CardTitle>
        {prompt && !isLoading && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRegenerate}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group"
            >
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap min-h-[100px]">
                {prompt}
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 shadow-sm"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
