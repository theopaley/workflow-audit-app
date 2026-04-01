import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const CLASSIFY_SYSTEM_PROMPT = `You are a business classifier for a workflow audit tool. Given a business description, classify the business into one of these verticals: "home-services", "property-maintenance", or "universal".

Key distinction — recurring vs. project-based:
- property-maintenance = recurring service agreements (lawn mowing, pool cleaning, pest control with agreements, recurring cleaning, irrigation maintenance, tree care on schedule)
- home-services = project-based or on-demand jobs (HVAC install/repair, plumbing, electrical, painting, flooring, roofing, remodeling, landscaping design/install, post-construction cleaning, pool repair or installation)
- Examples: "Pool cleaning or maintenance (recurring)" → property-maintenance. "Pool repair or installation (project)" → home-services. "Lawn mowing or recurring lawn care" → property-maintenance. "Landscaping design or installation" → home-services. "House cleaning (recurring)" → property-maintenance. "Post-construction cleaning" → home-services. "Pest control with service agreements" → property-maintenance. The distinction is always recurring vs. one-time — not the trade itself.

For "home-services", set serviceTypeKey to "hs_service_type" and pick serviceType from this exact list:
- "HVAC, Plumbing, or Electrical"
- "Painting, Flooring, or Interior Work"
- "Roofing, Siding, or Exterior Work"
- "Remodeling or General Contracting"
- "Other specialty or high-value work"
- "Other home services"

Use "Other specialty or high-value work" for high-value project-based trades that do not fit the above categories — e.g. water catchment installation, rainwater harvesting, tank installation, solar installation, generator installation, home automation, custom metalwork, or any specialty trade where a single job typically exceeds $5,000. Use "Other home services" only for genuinely ambiguous or lower-value cases.

For "property-maintenance", set serviceTypeKey to "pm_service_type" and pick serviceType from this exact list:
- "Lawn Care or Landscaping Maintenance"
- "Pool Cleaning and Maintenance"
- "Pest Control or Mosquito/Tick Treatment"
- "Recurring Cleaning or Janitorial"
- "Irrigation Maintenance"
- "Tree Care or Arborist Services"
- "Other recurring property service"

Return ONLY valid JSON in this exact format: { "slug": "home-services", "confidence": "high", "serviceType": "HVAC, Plumbing, or Electrical", "serviceTypeKey": "hs_service_type" }
For property-maintenance: { "slug": "property-maintenance", "confidence": "high", "serviceType": "Lawn Care or Landscaping Maintenance", "serviceTypeKey": "pm_service_type" }
If slug is "universal": { "slug": "universal", "confidence": "high", "serviceType": null, "serviceTypeKey": null }
No markdown, no explanation.`;

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
    system: CLASSIFY_SYSTEM_PROMPT,
    messages: [{ role: "user", content: businessDescription }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text.trim() : "";
  const result = JSON.parse(text);

  return NextResponse.json(result);
}
