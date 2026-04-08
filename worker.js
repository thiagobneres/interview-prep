/**
 * Cloudflare Worker — Interview Prep API Proxy
 * 
 * This worker sits between the browser and the Anthropic API.
 * The ANTHROPIC_API_KEY is stored as a Cloudflare secret — never visible in the browser.
 *
 * HOW TO DEPLOY:
 * 1. Go to https://dash.cloudflare.com → Workers & Pages → Create Worker
 * 2. Paste this entire file into the editor
 * 3. Click Settings → Variables → Add secret: ANTHROPIC_API_KEY = (your key)
 * 4. Deploy, then copy the worker URL into CONFIG.workerUrl in index.html
 */

export default {
  async fetch(request, env) {

    // ── CORS — allow your GitHub Pages domain ──
    const allowedOrigins = [
      "https://YOUR_GITHUB_USERNAME.github.io",   // ← update this
      "http://localhost:8080",                      // for local testing
      "http://127.0.0.1:5500",                     // VS Code Live Server
    ];

    const origin = request.headers.get("Origin") || "";
    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Only accept POST
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();

      // Forward to Anthropic
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }
};
