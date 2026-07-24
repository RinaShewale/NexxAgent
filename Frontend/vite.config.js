import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },

      "/agent-proxy": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/agent-proxy\/[^/]+/, ""),

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            const match = (req.originalUrl || req.url).match(
              /^\/agent-proxy\/([^/]+)/
            );

            if (match) {
              proxyReq.setHeader("Host", `${match[1]}.agent.localhost`);
            }
          });

          proxy.on("proxyReqWs", (proxyReq, req) => {
            const match = (req.originalUrl || req.url).match(
              /^\/agent-proxy\/([^/]+)/
            );

            if (match) {
              proxyReq.setHeader("Host", `${match[1]}.agent.localhost`);
            }
          });

          proxy.on("error", (err) => {
            console.error("Agent Proxy Error:", err.message);
          });
        },
      },

      "/preview-proxy": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/preview-proxy\/[^/]+/, ""),

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            const match = (req.originalUrl || req.url).match(
              /^\/preview-proxy\/([^/]+)/
            );

            if (match) {
              proxyReq.setHeader("Host", `${match[1]}.preview.localhost`);
            }
          });

          proxy.on("proxyReqWs", (proxyReq, req) => {
            const match = (req.originalUrl || req.url).match(
              /^\/preview-proxy\/([^/]+)/
            );

            if (match) {
              proxyReq.setHeader("Host", `${match[1]}.preview.localhost`);
            }
          });

          proxy.on("error", (err) => {
            console.error("Preview Proxy Error:", err.message);
          });
        },
      },
    },
  },
});