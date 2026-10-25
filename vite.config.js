import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// GET /slow?n=1&delay=300 answers {"n":1} after `delay` ms.
const slow = {
  name: "slow-endpoint",
  configureServer(server) {
    server.middlewares.use("/slow", (req, res) => {
      const url = new URL(req.url, "http://localhost");
      const n = Number(url.searchParams.get("n"));
      const delay = Number(url.searchParams.get("delay"));
      setTimeout(() => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ n }));
      }, delay);
    });
  },
};

export default defineConfig({ plugins: [react(), slow], server: { port: 5199, strictPort: true } });
