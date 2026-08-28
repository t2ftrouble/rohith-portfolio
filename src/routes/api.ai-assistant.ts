import { createFileRoute } from "@tanstack/react-router";
import { verifyAdminToken } from "@/lib/admin-session";

export const Route = createFileRoute("/api/ai-assistant")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          // Check admin session
          const cookieHeader = request.headers.get("cookie");
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);
          if (!adminSessionMatch || !adminSessionMatch[1] || !(await verifyAdminToken(adminSessionMatch[1]))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          const geminiConfigured = Boolean(process.env["GEMINI_API_KEY"]);
          const openaiConfigured = Boolean(process.env["OPENAI_API_KEY"]);

          return new Response(
            JSON.stringify({
              geminiConfigured,
              openaiConfigured,
              localFallbackAvailable: true,
              activeDefaultProvider: geminiConfigured ? "gemini" : openaiConfigured ? "openai" : "local",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      POST: async ({ request }) => {
        try {
          // Check admin session
          const cookieHeader = request.headers.get("cookie");
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);
          if (!adminSessionMatch || !adminSessionMatch[1] || !(await verifyAdminToken(adminSessionMatch[1]))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          const { prompt, projectContext, provider = "gemini" } = (await request.json()) as {
            prompt: string;
            projectContext: Record<string, any>;
            provider?: "gemini" | "openai" | "local";
          };

          const ctx = projectContext || {};
          const openaiKey = process.env["OPENAI_API_KEY"];
          const geminiKey = process.env["GEMINI_API_KEY"];

          const systemInstruction = `You are a film publicist, creative director, and cinematic copywriter for independent filmmaker & creator Rohith V.
MANDATORY RULES:
1. INPUT LANGUAGE: The user may provide notes/ideas in Tamil, Tanglish, Hindi, Malayalam, English or mixed languages.
2. OUTPUT LANGUAGE: You MUST return ENGLISH ONLY. Never output Tamil or Tanglish.
3. FACT INTEGRITY: Use ONLY facts provided in the project context. NEVER invent fake awards, festival laureates, or client names.
4. TONE: Minimal, cinematic, editorial, film case-study tone. Avoid generic AI fluff or corporate clichés.
5. FORMAT: Return a valid JSON object matching ALL 13 requested fields:
{
  "title": "...",
  "logline": "...",
  "shortSynopsis": "...",
  "fullSynopsis": "...",
  "directorNote": "...",
  "storyContext": "...",
  "myContribution": "...",
  "creativeApproach": "...",
  "creditsDescription": "...",
  "seoTitle": "...",
  "seoDescription": "...",
  "seoKeywords": "...",
  "ogDescription": "...",
  "tags": ["FILMMAKING", "SHORT FILM", "VFX", "EDITING"]
}`;

          const userContent = `User Request: ${prompt || "Generate full cinematic copy based on current project data."}
Project Context:
Title: ${String(ctx["title"] || "")}
Category: ${String(ctx["category"] || "FILMMAKING")}
Type: ${String(ctx["type"] || "Short Film")}
Role: ${String(ctx["role"] || "Director")}
Year: ${String(ctx["year"] || "")}
Existing Description: ${String(ctx["description"] || "")}
Visuals: ${String(ctx["visuals"] || "")}
Contribution: ${Array.isArray(ctx["process"]) ? (ctx["process"] as string[]).join(", ") : ""}
What I Felt / Director Note: ${String(ctx["whatIFelt"] || "")}
Full Credits: ${String(ctx["fullCredits"] || "")}`;

          // Provider 1: Gemini (PRIMARY)
          if (provider === "gemini") {
            if (!geminiKey) {
              return new Response(
                JSON.stringify({
                  error: "GEMINI_API_KEY is not configured in .env. Please configure GEMINI_API_KEY or select Local Fallback.",
                  code: "GEMINI_KEY_MISSING",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
              );
            }

            try {
              const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    contents: [
                      {
                        parts: [
                          { text: systemInstruction },
                          { text: userContent },
                        ],
                      },
                    ],
                    generationConfig: {
                      responseMimeType: "application/json",
                    },
                  }),
                }
              );

              if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData?.error?.message || `Gemini API returned HTTP ${res.status}`);
              }

              const data = await res.json();
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                return new Response(JSON.stringify({ result: JSON.parse(text), providerUsed: "gemini" }), {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                });
              }
            } catch (err: any) {
              return new Response(JSON.stringify({ error: `Gemini API call failed: ${err.message}` }), {
                status: 502,
                headers: { "Content-Type": "application/json" },
              });
            }
          }

          // Provider 2: OpenAI (OPTIONAL)
          if (provider === "openai") {
            if (!openaiKey) {
              return new Response(
                JSON.stringify({
                  error: "OPENAI_API_KEY is not configured in .env. Please configure OPENAI_API_KEY or select Gemini / Local Fallback.",
                  code: "OPENAI_KEY_MISSING",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
              );
            }

            try {
              const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${openaiKey}`,
                },
                body: JSON.stringify({
                  model: "gpt-4o-mini",
                  messages: [
                    { role: "system", content: systemInstruction },
                    { role: "user", content: userContent },
                  ],
                  response_format: { type: "json_object" },
                  temperature: 0.7,
                }),
              });

              if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData?.error?.message || `OpenAI API returned HTTP ${res.status}`);
              }

              const data = await res.json();
              const content = data.choices?.[0]?.message?.content;
              if (content) {
                return new Response(JSON.stringify({ result: JSON.parse(content), providerUsed: "openai" }), {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                });
              }
            } catch (err: any) {
              return new Response(JSON.stringify({ error: `OpenAI API call failed: ${err.message}` }), {
                status: 502,
                headers: { "Content-Type": "application/json" },
              });
            }
          }

          // Provider 3: Local Fallback Cinematic Engine
          const title = String(ctx["title"] || (prompt ? prompt.split(" ")[0] : "New Film"));
          const pType = String(ctx["type"] || "Short Film");
          const category = String(ctx["category"] || "FILMMAKING");
          const desc = String(ctx["description"] || "");
          const cleanTitle = title.charAt(0).toUpperCase() + title.slice(1);

          const fallbackResult = {
            title: cleanTitle,
            logline: String(ctx["emotionalDescriptor"] || `A cinematic journey into silence, visual atmosphere and emotional weight.`),
            shortSynopsis: desc || `An independent film exploration directing focus onto subtle character moments and visual depth.`,
            fullSynopsis: desc
              ? `${desc} Built from minimal resources, this project explores narrative rhythm, atmosphere, and visual storytelling.`
              : `A story told with patience, letting visual rhythm and silence carry the emotional tension.`,
            directorNote: String(
              ctx["whatIFelt"] ||
              "Every frame is designed with patience and intention, letting the emotional subtext guide the edit and sound design."
            ),
            storyContext: `Developed as an exploration of indie filmmaking techniques, blocking, and visual restraint.`,
            myContribution: `Story planning, direction, shot framing, visual effects integration, editing, and sound supervision.`,
            creativeApproach: `Minimalist lighting with naturalistic framing, emphasizing human reaction and space.`,
            creditsDescription: `Directed and Edited by Rohith V.`,
            seoTitle: `${cleanTitle} — ${pType} | Rohith V`,
            seoDescription: desc
              ? `${desc.slice(0, 155)}...`
              : `Cinematic case study and film production breakdown by filmmaker Rohith V.`,
            seoKeywords: `${cleanTitle}, Rohith V, Filmmaking, ${pType}, ${category}, Chennai Filmmaker, Video Editing`,
            ogDescription: desc || `Cinematic film case study directed and edited by Rohith V.`,
            tags: [
              category,
              pType ? pType.toUpperCase() : "SHORT FILM",
              "DIRECTION",
              "EDITING",
              "CINEMATOGRAPHY",
            ],
          };

          return new Response(
            JSON.stringify({
              result: fallbackResult,
              providerUsed: "local",
              note: "Generated using built-in local cinematic rules engine.",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message || "Failed to generate copy" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
