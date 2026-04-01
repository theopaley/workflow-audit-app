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
      'You are a business classifier for a workflow audit tool. Given a business description, classify the business into one of these verticals: "home-services", "property-maintenance", or "universal".\n\nKey distinction — recurring vs. project-based:\n- property-maintenance = recurring service agreements (lawn mowing, pool cleaning, pest control with agreements, recurring cleaning, irrigation maintenance, tree care on schedule)\n- home-services = project-based or on-demand jobs (HVAC install/repair, plumbing, electrical, painting, flooring, roofing, remodeling, landscaping design/install, post-construction cleaning, pool repair or installation)\n- Examples: "Pool cleaning or maintenance (recurring)" → property-maintenance. "Pool repair or installation (project)" → home-services. "Lawn mowing or recurring lawn care" → property-maintenance. "Landscaping design or installation" → home-services. "House cleaning (recurring)" → property-maintenance. "Post-construction cleaning" → home-services. "Pest control with service agreements" → property-maintenance. The distinction is always recurring vs. one-time — not the trade itself.\n\nFor "home-services", set serviceTypeKey to "hs_service_type" and pick serviceType from this exact list:\n- "HVAC, Plumbing, or Electrical"\n- "Painting, Flooring, or Interior Work"\n- "Roofing, Siding, or Exterior Work"\n- "Remodeling or General Contracting"\n- "Other home services"\n\nFor "property-maintenance", set serviceTypeKey to "pm_service_type" and pick serviceType from this exact list:\n- "Lawn Care or Landscaping Maintenance"\n- "Pool Cleaning and Maintenance"\n- "Pest Control or Mosquito/Tick Treatment"\n- "Recurring Cleaning or Janitorial"\n- "Irrigation Maintenance"\n- "Tree Care or Arborist Services"\n- "Other recurring property service"\n\nReturn ONLY valid JSON in this exact format: { "slug": "home-services", "confidence": "high", "serviceType": "HVAC, Plumbing, or Electrical", "serviceTypeKey": "hs_service_type" }\nFor property-maintenance: { "slug": "property-maintenance", "confidence": "high", "serviceType": "Lawn Care or Landscaping Maintenance", "serviceTypeKey": "pm_service_type" }\nIf slug is "universal": { "slug": "universal", "confidence": "high", "serviceType": null, "serviceTypeKey": null }\nNo markdown, no explanation.',
    messages: [{ role: "user", content: businessDescription }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text.trim() : "";
  const result = JSON.parse(text);

  return NextResponse.json(result);
}
