import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const CLASSIFY_SYSTEM_PROMPT = `You are a business classifier for a workflow audit tool. Given a business description, classify the business into one of these verticals: "home-services", "property-maintenance", "real-estate", "med-spa", "commercial-insurance", "b2b-sales", "fitness-wellness", or "universal".

MED SPA — classify as "med-spa" when the description mentions: med spa, medspa, medical spa, aesthetic clinic, aesthetics practice, Botox, fillers, injectables, neurotoxin, dermal filler, laser treatments, microneedling, HydraFacial, body contouring, IV therapy, hormone therapy, regenerative medicine, PRP, medical aesthetics, cosmetic injections, non-surgical, injector, nurse injector, aesthetic nurse.
Edge cases: "I do Botox and fillers" → med-spa. "I run a day spa with massages and facials" → universal. "I'm a chiropractor" → universal. "I do IV drips and aesthetic treatments" → med-spa. "I sell regenerative medicine products to med spas" → universal.

REAL ESTATE — classify as "real-estate" when the description mentions: real estate agent, realtor, licensed agent, buyer's agent, listing agent, sell homes, sell houses, help buyers, help sellers, commission, closings, transactions, MLS, residential real estate, commercial real estate, luxury real estate, real estate broker, flip houses, real estate investing, wholesaling.
Edge cases: "I sell homes" → real-estate. "I flip houses" → real-estate. "I manage rental properties as a property manager" → real-estate (property management as a professional service). "I manage an Airbnb portfolio" → property-maintenance. "I do lawn care for rental properties" → property-maintenance.

HOME SERVICES vs. PROPERTY MAINTENANCE — key distinction is recurring vs. project-based:
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

For "real-estate", set serviceTypeKey to "re_focus_type" and pick serviceType from this exact list:
- "Residential sales — buyers and sellers"
- "Luxury or high-end residential"
- "Commercial real estate"
- "Property management"
- "Real estate investing / wholesaling"
- "Mixed — I do several of these"

For "med-spa", set serviceTypeKey to "hw_service_focus" and pick serviceType from this exact list:
- "Injectables — Botox, fillers, neurotoxins"
- "Laser & energy treatments — laser resurfacing, IPL, body contouring"
- "Regenerative & wellness — IV therapy, PRP, hormone therapy, peptides"
- "Full-service aesthetics — injectables plus laser plus skincare"
- "Skincare & facial treatments — HydraFacial, microneedling, chemical peels"

COMMERCIAL INSURANCE — classify as "commercial-insurance" when the description mentions: commercial insurance, commercial lines, business insurance, commercial broker, general liability, workers comp, workers compensation, commercial auto, commercial property, business owner policy, BOP, professional liability, E&O, errors and omissions, D&O, directors and officers, cyber liability, insurance broker, insurance agent, insurance agency, writing commercial accounts, commercial book, commercial coverage.
Edge cases: "I sell commercial insurance policies" → commercial-insurance. "I'm an independent insurance agent" → commercial-insurance if commercial focus, universal if personal lines only. "I sell personal auto and homeowners insurance" → universal. "I sell group health benefits to businesses" → commercial-insurance. "I do risk management consulting" → commercial-insurance. "I'm a captive agent for State Farm selling auto and home" → universal.

For "commercial-insurance", set serviceTypeKey to "ci_lines_focus" and pick serviceType from this exact list:
- "General liability, BOP, and property"
- "Workers compensation"
- "Professional liability — E&O, D&O, cyber"
- "Commercial auto and fleet"
- "Specialty and surplus lines"
- "Mixed commercial lines"

B2B SALES — classify as "b2b-sales" when the business's PRIMARY revenue activity is selling products or services TO other businesses through a dedicated sales team or rep structure. Triggers: B2B sales, business to business, sell to businesses, sell to companies, sales team, sales reps, account executives, sales organization, field sales, outside sales, inside sales, sales force, distributor, distribution company, wholesale, product rep, account manager, territory manager, regional sales manager, "we sell [product/service] to [businesses/clinics/contractors/dentists/etc.]."
Edge cases: "I sell medical products to clinics" → b2b-sales. "I sell software to businesses" → b2b-sales. "I'm a real estate agent" → real-estate. "I'm an insurance broker" → commercial-insurance. "I run a marketing agency" → universal. "I have a sales team that sells our HVAC services" → home-services.

For "b2b-sales", set serviceTypeKey to "bs_sales_model" and pick serviceType from this exact list:
- "Field sales — reps visit prospects and clients in person"
- "Inside sales — reps sell primarily by phone, email, and video"
- "Hybrid — a mix of in-person and remote selling"
- "Owner-led — I personally handle most or all of the selling"
- "Channel/distributor — we sell through partners or reps who represent us"

FITNESS & WELLNESS — classify as "fitness-wellness" when the description mentions: gym, fitness center, health club, yoga studio, pilates studio, CrossFit, CrossFit affiliate, functional fitness, boutique studio, spin studio, cycling studio, barre studio, boxing gym, MMA gym, martial arts studio, kickboxing, personal training studio, group fitness, boot camp, strength training, fitness classes, wellness center, fitness facility, gym owner, studio owner, memberships, member retention.
Edge cases: "I own a gym" → fitness-wellness. "I run a yoga studio" → fitness-wellness. "I'm a personal trainer with my own studio" → fitness-wellness. "I'm a personal trainer who works at a gym" → universal. "I run a day spa with massages and facials" → universal. "I do Botox and fillers" → med-spa. "I'm a chiropractor" → universal. "I sell fitness equipment to gyms" → b2b-sales. "I run a CrossFit box" → fitness-wellness. "I own a martial arts academy" → fitness-wellness. "I'm a fitness influencer" → universal.

For "fitness-wellness", set serviceTypeKey to "fw_facility_type" and pick serviceType from this exact list:
- "Gym or fitness center"
- "Boutique studio"
- "Personal training studio"
- "CrossFit or functional fitness affiliate"
- "Martial arts, boxing, or MMA gym"
- "Wellness center"
- "Mixed — multiple formats or modalities"

Return ONLY valid JSON in this exact format: { "slug": "home-services", "confidence": "high", "serviceType": "HVAC, Plumbing, or Electrical", "serviceTypeKey": "hs_service_type" }
For property-maintenance: { "slug": "property-maintenance", "confidence": "high", "serviceType": "Lawn Care or Landscaping Maintenance", "serviceTypeKey": "pm_service_type" }
For real-estate: { "slug": "real-estate", "confidence": "high", "serviceType": "Residential sales — buyers and sellers", "serviceTypeKey": "re_focus_type" }
For med-spa: { "slug": "med-spa", "confidence": "high", "serviceType": "Injectables — Botox, fillers, neurotoxins", "serviceTypeKey": "hw_service_focus" }
For commercial-insurance: { "slug": "commercial-insurance", "confidence": "high", "serviceType": "General liability, BOP, and property", "serviceTypeKey": "ci_lines_focus" }
For b2b-sales: { "slug": "b2b-sales", "confidence": "high", "serviceType": "Inside sales — reps sell primarily by phone, email, and video", "serviceTypeKey": "bs_sales_model" }
For fitness-wellness: { "slug": "fitness-wellness", "confidence": "high", "serviceType": "Gym or fitness center", "serviceTypeKey": "fw_facility_type" }
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
