import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  let businessDescription: string;

  try {
    ({ businessDescription } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!businessDescription || typeof businessDescription !== "string") {
    return NextResponse.json({ error: "businessDescription is required" }, { status: 400 });
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 200,
    system:
      'You are a business classifier for a workflow audit tool. Given a business description, classify the business into one of these verticals: home-services. If the business does not match any vertical, return "universal".\n\nFor home-services, also identify the specific service type from this exact list (use the string verbatim):\n- "HVAC, Plumbing, or Electrical"\n- "Landscaping, Lawn Care, or Tree Service"\n- "Painting, Flooring, or Interior Work"\n- "Cleaning or Janitorial Services"\n- "Roofing, Siding, or Exterior Work"\n- "Remodeling or General Contracting"\n- "Pool, Pressure Washing, or Specialty Exterior"\n- "Other home services"\n\nReturn ONLY valid JSON in this exact format: { "slug": "home-services", "confidence": "high", "serviceType": "HVAC, Plumbing, or Electrical" }\nIf slug is "universal", return: { "slug": "universal", "confidence": "high", "serviceType": null }\nNo markdown, no explanation.',
    messages: [{ role: "user", content: businessDescription }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text.trim() : "";
  const result = JSON.parse(text);

  return NextResponse.json(result);
}
