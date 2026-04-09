import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Link as LinkIcon, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelect: (file: File | string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

export function ImageUploader({ onImageSelect, selectedImage, onClear }: ImageUploaderProps) {
  const [url, setUrl] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageSelect(acceptedFiles[0]);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  } as any);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onImageSelect(url);
      setUrl("");
    }
  };

  return (
    <div className="space-y-4">
      {!selectedImage ? (
        <>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            <input {...getInputProps()} />
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium">Drag & drop an image here</p>
            <p className="text-sm text-muted-foreground mt-1">or click to browse from your device</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or use a URL</span>
            </div>
          </div>

          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Paste image URL..."
                className="pl-10"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary">
              Load
            </Button>
          </form>

          <div className="flex justify-center gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.capture = 'environment';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) onImageSelect(file);
              };
              input.click();
            }}>
              <Camera className="w-4 h-4 mr-2" />
              Use Camera
            </Button>
          </div>
        </>
      ) : (
        <Card className="relative overflow-hidden group rounded-xl border-2 border-primary/20">
          <img
            src={selectedImage}
            alt="Selected"
            className="w-full h-auto max-h-[400px] object-contain bg-black/5"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="destructive" className="rounded-full h-8 w-8" onClick={onClear}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
