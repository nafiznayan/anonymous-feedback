import { generateText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt = "Create a new holiday and describe its traditions.";
    const result = await generateText({
      model: "openai/gpt-4.1",
      prompt: prompt,
    });

    return Response.json({ message: result.text });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to suggest messages:", error.message);
    } else {
      console.error("Failed to suggest messages:", error);
      throw error;
    }
  }
}
