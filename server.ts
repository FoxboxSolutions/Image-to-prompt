import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API routes
  app.get("/api/health", (req, res) => {
    console.log("Health check hit");
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  app.post("/api/ai/llava", async (req, res) => {
    if (typeof fetch === 'undefined') {
      return res.status(500).json({ error: "Fetch is not available in this Node environment. Please upgrade Node or install node-fetch." });
    }
    const { image, prompt } = req.body;
    console.log("LLaVA API hit", { 
      hasImage: !!image, 
      imageLength: image?.length,
      prompt: prompt 
    });
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      return res.status(500).json({ 
        error: "Cloudflare credentials not configured. Please set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in the Secrets panel." 
      });
    }

    try {
      // Convert base64 to Uint8Array as expected by Cloudflare AI
      const base64Data = image.split(",")[1] || image;
      const binaryData = Buffer.from(base64Data, 'base64');
      const uint8Array = new Uint8Array(binaryData);

      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/llava-hf/llava-1.5-7b-hf`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: Array.from(uint8Array),
            prompt: prompt,
            max_tokens: 512,
          }),
        }
      );

      const result = await response.json();
      res.json(result);
    } catch (error) {
      console.error("Cloudflare AI Error:", error);
      res.status(500).json({ error: "Failed to process image with Cloudflare AI" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
