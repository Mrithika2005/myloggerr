import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to receive logs and write them to a file
  app.post("/api/logs", (req, res) => {
    const r = req.body;
    
    const ts = r.timestamp || new Date().toISOString();
    const lv = r.level === 20 ? 'INFO' : r.level === 40 ? 'ERROR' : 'LOG';
    const layer = (r.layer || 'infra').toUpperCase();
    
    let line = `[${ts}] [${lv}] [${layer}] ${r.message}\n`;
    
    // DDD Domain Event Details
    if (r.event_name) {
      line += `  ✨ EVENT: ${r.event_name}\n`;
      line += `  📦 ENTITY: ${r.entity_type} (${r.entity_id})\n`;
    }
    
    // State Changes
    if (r.prev_state || r.next_state) {
      line += `  🔄 STATE: ${r.prev_state || '?'} ⮕ ${r.next_state || '?'}\n`;
    }

    // Context / Metadata
    const meta = { ...r };
    delete meta.message; delete meta.timestamp; delete meta.level; 
    delete meta.layer; delete meta.event_name; delete meta.entity_type; 
    delete meta.entity_id; delete meta.prev_state; delete meta.next_state;
    delete meta.record_id; delete meta.service; delete meta.env;

    if (Object.keys(meta).length > 0) {
      line += `  📝 CONTEXT: ${JSON.stringify(meta)}\n`;
    }
    
    line += `  🆔 ID: ${r.record_id} | 🌐 ${r.service}:${r.env}\n`;
    line += `--------------------------------------------------------------------------------\n`;
    
    fs.appendFile(path.join(process.cwd(), "logs.txt"), line, (err) => {
      if (err) return res.status(500).json({ error: "Failed to write log" });
      res.json({ status: "ok" });
    });
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
    console.log(`Logs will be written to ${path.join(process.cwd(), "logs.json")}`);
  });
}

startServer();
