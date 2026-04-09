import React, { useState, useEffect } from "react";
import { Sparkles, Image as ImageIcon, Globe, Languages, Zap, ShieldCheck, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/src/components/ImageUploader";
import { PromptOutput } from "@/src/components/PromptOutput";
import { History, HistoryItem } from "@/src/components/History";
import { SEOBlocks } from "@/src/components/SEOBlocks";
import { generatePrompt, ModelPreset } from "@/src/lib/gemini";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("");
  const [preset, setPreset] = useState<ModelPreset>("Midjourney");
  const [language, setLanguage] = useState("English");
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("prompt_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("prompt_history", JSON.stringify(history));
  }, [history]);

  const handleImageSelect = async (input: File | string) => {
    if (typeof input === "string") {
      // URL
      setSelectedImage(input);
      setMimeType("image/jpeg"); // Assume jpeg for URLs
    } else {
      // File
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setMimeType(input.type);
      };
      reader.readAsDataURL(input);
    }
    setGeneratedPrompt(null);
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    setIsLoading(true);
    try {
      const prompt = await generatePrompt(selectedImage, mimeType, preset, language);
      if (prompt) {
        setGeneratedPrompt(prompt);
        
        // Add to history
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          image: selectedImage,
          prompt,
          preset,
          timestamp: Date.now(),
        };
        setHistory(prev => [newItem, ...prev].slice(0, 20));
        toast.success("Prompt generated successfully!");
      }
    } catch (error) {
      toast.error("Failed to generate prompt. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
    toast.success("History cleared");
  };

  const selectHistoryItem = (item: HistoryItem) => {
    setSelectedImage(item.image);
    setGeneratedPrompt(item.prompt);
    setPreset(item.preset);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-black text-xl tracking-tight">PromptVision<span className="text-primary">AI</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">How it works</a>
            <a href="#" className="hover:text-primary transition-colors">Presets</a>
            <a href="#" className="hover:text-primary transition-colors">FAQ</a>
          </nav>
          <Button variant="outline" size="sm" className="rounded-full">
            <Globe className="w-4 h-4 mr-2" />
            EN
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Image to <span className="text-primary">AI Prompt</span> Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform any image into optimized prompts for Midjourney, Flux, and Stable Diffusion in seconds.
            </p>
          </motion.div>
        </section>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column: Controls */}
          <div className="lg:col-span-7 space-y-8">
            <ImageUploader
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onClear={() => {
                setSelectedImage(null);
                setGeneratedPrompt(null);
              }}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Model Preset
                </Label>
                <Select value={preset} onValueChange={(v) => setPreset(v as ModelPreset)}>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Select preset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Midjourney">Midjourney v6</SelectItem>
                    <SelectItem value="Flux">Flux.1 (Pro/Dev)</SelectItem>
                    <SelectItem value="Stable Diffusion">Stable Diffusion XL</SelectItem>
                    <SelectItem value="General">General / DALL-E 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold flex items-center gap-2">
                  <Languages className="w-4 h-4 text-blue-500" />
                  Output Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="French">Français</SelectItem>
                    <SelectItem value="Spanish">Español</SelectItem>
                    <SelectItem value="German">Deutsch</SelectItem>
                    <SelectItem value="Japanese">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              onClick={handleGenerate}
              disabled={!selectedImage || isLoading}
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Generate Prompt
                </>
              )}
            </Button>

            <PromptOutput
              prompt={generatedPrompt}
              isLoading={isLoading}
              onRegenerate={handleGenerate}
            />
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-muted/30 rounded-2xl p-6 border border-muted-foreground/10">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                Privacy & Security
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  Zero-retention policy: Images are never saved.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  Processed in RAM and discarded immediately.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  GDPR & CCPA compliant architecture.
                </li>
              </ul>
            </div>

            <History
              items={history}
              onDelete={deleteHistoryItem}
              onClear={clearHistory}
              onSelect={selectHistoryItem}
            />
          </div>
        </div>

        {/* SEO Content */}
        <SEOBlocks />
      </main>

      <footer className="border-t py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-primary p-1 rounded-lg">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-black text-lg tracking-tight">PromptVision AI</span>
          </div>
          <p className="text-sm text-muted-foreground mb-8">
            © 2026 PromptVision AI. Built for artists, by artists.
          </p>
          <div className="flex justify-center gap-8 text-xs font-medium text-muted-foreground uppercase tracking-widest">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
