import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function SEOBlocks() {
  return (
    <div className="space-y-16 py-16 border-t mt-16">
      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-columns-3 gap-8">
          {[
            { step: "01", title: "Upload Image", desc: "Drag and drop any image or paste a URL to get started." },
            { step: "02", title: "Select Model", desc: "Choose between Midjourney, Flux, Stable Diffusion, or General presets." },
            { step: "03", title: "Get Prompt", desc: "Our AI analyzes the visual elements and generates a perfect prompt." }
          ].map((item) => (
            <div key={item.step} className="relative p-6 rounded-2xl bg-muted/30">
              <span className="text-4xl font-black text-primary/10 absolute top-4 right-6">{item.step}</span>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Loved by AI Artists</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Alex R.", role: "Midjourney Artist", text: "Finally, a tool that understands lighting and composition descriptors. Saved me hours of trial and error." },
              { name: "Sarah K.", role: "Content Creator", text: "The Flux preset is incredibly accurate. It captures textures I didn't even notice myself." },
              { name: "Michael T.", role: "SD Enthusiast", text: "The keyword tagging for Stable Diffusion is spot on. Perfect for building complex workflows." }
            ].map((t, i) => (
              <Card key={i} className="border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-primary text-primary" />)}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{t.text}"</p>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is this tool free to use?</AccordionTrigger>
            <AccordionContent>
              Yes, PromptVision AI is currently free to use. We leverage advanced AI models to provide high-quality prompts at no cost to our users.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Which AI models are supported?</AccordionTrigger>
            <AccordionContent>
              We provide optimized presets for Midjourney (v6), Flux.1, Stable Diffusion (XL/1.5), and a General preset for other models like DALL-E 3 or Adobe Firefly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Are my images stored on your servers?</AccordionTrigger>
            <AccordionContent>
              No. We have a zero-retention policy. Images are processed in memory and never saved to any disk or database. Your privacy is our priority.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Can I use this on mobile?</AccordionTrigger>
            <AccordionContent>
              Absolutely! Our interface is fully responsive and supports mobile camera uploads directly from your browser.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Structured Data (Schema.org) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "PromptVision AI",
          "operatingSystem": "Web",
          "applicationCategory": "MultimediaApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "description": "Transform images into optimized AI prompts for Midjourney, Flux, and Stable Diffusion in seconds."
        })}
      </script>
    </div>
  );
}
