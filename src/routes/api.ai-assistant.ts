import { createFileRoute } from "@tanstack/react-router";
import { verifyAdminToken } from "@/lib/admin-session";

export const Route = createFileRoute("/api/ai-assistant")({
  server: {
    handlers: {
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

          const { prompt, projectContext } = (await request.json()) as {
            prompt: string;
            projectContext: Record<string, any>;
            type?: "seo" | "story" | "tags" | "all";
          };

          const ctx = projectContext || {};
          const openaiKey = process.env["OPENAI_API_KEY"];
          const geminiKey = process.env["GEMINI_API_KEY"];

          const systemInstruction = `You are a film publicist and cinematic copywriter for independent filmmaker Rohith V.
MANDATORY RULES:
1. INPUT LANGUAGE: The user may ask in Tamil, Tanglish, Hindi, Malayalam, English or any mixed language.
2. OUTPUT LANGUAGE: You MUST return ENGLISH ONLY. Never output Tamil or Tanglish.
3. FACT INTEGRITY: Use ONLY facts provided in the project context. NEVER invent fake awards, festivals, client names, or credits.
4. TONE: Minimal, cinematic, editorial, prestigious, film case-study tone. Avoid generic AI fluff or over-the-top dramatic clichés.
5. FORMAT: Return a valid JSON object matching the requested fields:
{
  "seoTitle": "...",
  "metaDescription": "...",
  "keywords": "keyword1, keyword2, ...",
  "ogTitle": "...",
  "ogDescription": "...",
  "imageAlt": "...",
  "logline": "...",
  "synopsis": "...",
  "directorNote": "...",
  "tags": ["FILMMAKING", "SHORT FILM", "VFX", ...]
}`;

          const userContent = `User Request: ${prompt || "Generate full cinematic copy based on current project data."}
Project Context:
Title: ${String(ctx["title"] || "Untitled")}
Category: ${String(ctx["category"] || "FILMMAKING")}
Type: ${String(ctx["type"] || "Short Film")}
Role: ${String(ctx["role"] || "Director")}
Year: ${String(ctx["year"] || "")}
Existing Description: ${String(ctx["description"] || "")}
Visuals: ${String(ctx["visuals"] || "")}
Contribution: ${Array.isArray(ctx["process"]) ? (ctx["process"] as string[]).join(", ") : ""}
What I Felt: ${String(ctx["whatIFelt"] || "")}
Full Credits: ${String(ctx["fullCredits"] || "")}`;

          // 1. Try OpenAI API if key exists
          if (openaiKey) {
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

              if (res.ok) {
                const data = await res.json();
                const content = data.choices?.[0]?.message?.content;
                if (content) {
                  return new Response(JSON.stringify({ result: JSON.parse(content) }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                  });
                }
              }
            } catch (err) {
              console.warn("OpenAI API call failed, trying Gemini or fallback:", err);
            }
          }

          // 2. Try Gemini API if key exists
          if (geminiKey) {
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

              if (res.ok) {
                const data = await res.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  return new Response(JSON.stringify({ result: JSON.parse(text) }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                  });
                }
              }
            } catch (err) {
              console.warn("Gemini API call failed:", err);
            }
          }

          // 3. Fallback Smart Rule-based Generator
          const title = String(ctx["title"] || "Project");
          const pType = String(ctx["type"] || "Short Film");
          const category = String(ctx["category"] || "FILMMAKING");
          const desc = String(ctx["description"] || "");

          const fallbackResult = {
            seoTitle: `${title} — ${pType} | Rohith V`,
            metaDescription: desc
              ? `${desc.slice(0, 155)}...`
              : `A cinematic case study by Rohith V exploring narrative, visual effects, and direction.`,
            keywords: `${title}, Rohith V, Filmmaking, ${pType}, ${category}, Chennai Filmmaker`,
            ogTitle: `${title} — ${pType} directed by Rohith V`,
            ogDescription: desc || "Cinematic case study and production breakdown.",
            imageAlt: `${title} film frame still`,
            logline: String(ctx["emotionalDescriptor"] || `A cinematic journey into silence and visual depth.`),
            synopsis: desc || "A compelling exploration of character and cinema.",
            directorNote:
              String(ctx["whatIFelt"] ||
              "Every frame is designed with patience and intention, letting the emotional subtext guide the edit."),
            tags: [
              category,
              pType ? pType.toUpperCase() : "SHORT FILM",
              "DIRECTION",
              "EDITING",
              "CINEMATOGRAPHY",
            ],
          };

          return new Response(JSON.stringify({ result: fallbackResult, note: "Generated via local cinematic rules (Configure OPENAI_API_KEY or GEMINI_API_KEY in .env for live AI)" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
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
