import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/payments/deposit", async (req, res) => {
    const { amount, description, payerName, payerDocument } = req.body;

    const clientId = process.env.PRO_PAYBR_CLIENT_ID;
    const clientSecret = process.env.PRO_PAYBR_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ success: false, error: "Payment gateway credentials not configured." });
    }

    try {
      const response = await fetch("https://api.propixbr.com/api/v1/deposit", {
        method: "POST",
        headers: {
          "x-client-id": clientId,
          "x-client-secret": clientSecret,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          description,
          payerName,
          payerDocument,
        }),
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Payment API Error:", error);
      res.status(500).json({ success: false, error: "Failed to communicate with payment gateway." });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
