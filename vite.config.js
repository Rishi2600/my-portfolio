import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// In production Vercel serves everything in api/ as a serverless function.
// Vite's dev server knows nothing about that, so `npm run dev` would 404 on
// /api/contact. This runs the same handler as Connect middleware, with the
// two Express-ish helpers it expects shimmed on, so local dev behaves like
// production without needing the Vercel CLI.
function vercelApiDev() {
  return {
    name: "vercel-api-dev",
    configureServer(server) {
      server.middlewares.use("/api/contact", async (req, res, next) => {
        try {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          // Hand the handler the raw string — it already parses and guards.
          req.body = Buffer.concat(chunks).toString("utf8");

          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
            return res;
          };

          const { default: handler } = await server.ssrLoadModule("/api/contact.js");
          await handler(req, res);
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // The third argument is the prefix filter. Passing "" loads every variable,
  // not just VITE_ ones — which is the only way the dev middleware can see
  // WEB3FORMS_KEY. It stays on the server side of the middleware; nothing
  // here exposes it to client code.
  const env = loadEnv(mode, process.cwd(), "");
  process.env.WEB3FORMS_KEY = env.WEB3FORMS_KEY;

  return { plugins: [react(), vercelApiDev()] };
});
