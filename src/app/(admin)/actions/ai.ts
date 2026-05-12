"use server";

import { requireAdmin } from "../../../lib/auth-server";

type AiDescriptionResponse =
  | {
      success: true;
      text: string;
    }
  | {
      success: false;
      error: string;
    };

export async function generateDescriptionWithAi(
  carDetails: string
): Promise<AiDescriptionResponse> {
  try {
    await requireAdmin();

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: "Google Gemini API key is missing.",
      };
    }

    const prompt = `
You are a premium automotive copywriter.

Write a professional, SEO-friendly car listing description using the vehicle details below.

Requirements:
- 180–240 words
- Start with a natural overview paragraph
- End with bullet-point highlights using "•"
- Mention performance, comfort, reliability, mileage, transmission, fuel type, color, and location naturally
- Premium dealership tone
- No fake claims or clichés
- Plain text only

Vehicle Details:
${carDetails}

Highlights must include:
• Year & Model
• Mileage
• Transmission
• Fuel Type
• Exterior Color
• Location

The response must end with a complete sentence.
`.trim();

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 15000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.6,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 350,
          },
        }),
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Gemini API Error:", errorText);

      return {
        success: false,
        error: "Failed to generate AI description.",
      };
    }

    const data = await response.json();

    const candidate = data?.candidates?.[0];

    if (!candidate) {
      return {
        success: false,
        error: "No AI response candidate returned.",
      };
    }

    const finishReason = candidate.finishReason;

    if (
      finishReason &&
      finishReason !== "STOP" &&
      finishReason !== "MAX_TOKENS"
    ) {
      return {
        success: false,
        error: `Generation stopped unexpectedly: ${finishReason}`,
      };
    }

    const generatedText =
      candidate?.content?.parts
        ?.map((part: { text?: string }) => part.text || "")
        .join("")
        .trim() || "";

    if (!generatedText) {
      return {
        success: false,
        error: "AI returned empty content.",
      };
    }

    return {
      success: true,
      text: generatedText,
    };
  } catch (error) {
    console.error("AI generation failed:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown AI generation error.",
    };
  }
}
