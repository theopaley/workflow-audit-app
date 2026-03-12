import { Resend } from "resend";
import type { AnalysisResult } from "./ai-analysis";
import type { SurveyAnswers } from "@/types/survey";

const resend = new Resend(process.env.RESEND_API_KEY);

const STRATEGY_CALL_URL = "https://workflow-audit-app.vercel.app";

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

function gradeColor(score: number): string {
  if (score <= 45) return "#ef4444";
  if (score <= 65) return "#f59e0b";
  return "#22c55e";
}

// ─── Owner email ──────────────────────────────────────────────────────────────

function buildOwnerEmail(result: AnalysisResult): string {
  const scoreColor = gradeColor(result.overallScore);
  const priorityRows = result.topThreePriorities
    .map(
      (p, i) => `
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width: 28px; vertical-align: top; padding-top: 2px;">
                  <span style="display: inline-block; width: 22px; height: 22px; background: #4f46e5; border-radius: 50%; color: white; font-size: 11px; font-weight: 700; text-align: center; line-height: 22px;">${i + 1}</span>
                </td>
                <td style="padding-left: 10px;">
                  <p style="margin: 0 0 3px 0; font-size: 15px; font-weight: 600; color: #1e293b;">${p.areaName}</p>
                  <p style="margin: 0 0 5px 0; font-size: 14px; color: #475569;">${p.headline}</p>
                  <p style="margin: 0; font-size: 13px; color: #64748b;"><strong style="color: #4f46e5;">First step:</strong> ${p.firstStep}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px;">

          <!-- Header -->
          <tr>
            <td style="background: #4f46e5; border-radius: 12px 12px 0 0; padding: 32px 40px 28px;">
              <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #a5b4fc;">WorkflowAudit</p>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; line-height: 1.3;">Your report is ready, ${result.ownerName.split(" ")[0]}.</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background: #ffffff; padding: 36px 40px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">

              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                ${result.reportOpening}
              </p>

              <!-- Score card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;">Overall Workflow Health</p>
                    <p style="margin: 0 0 4px 0; font-size: 52px; font-weight: 800; color: ${scoreColor}; line-height: 1;">${result.overallScore}</p>
                    <p style="margin: 0; font-size: 13px; color: #94a3b8;">out of 100</p>
                  </td>
                  <td style="padding: 24px; border-left: 1px solid #e2e8f0; text-align: center;">
                    <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;">Estimated Leakage</p>
                    <p style="margin: 0 0 4px 0; font-size: 36px; font-weight: 800; color: #ef4444; line-height: 1;">${fmt(result.totalMonthlyLeakage)}</p>
                    <p style="margin: 0; font-size: 13px; color: #94a3b8;">per month · ${fmt(result.totalAnnualLeakage)}/yr</p>
                  </td>
                </tr>
              </table>

              <!-- Top priorities -->
              <h2 style="margin: 0 0 4px 0; font-size: 17px; font-weight: 700; color: #1e293b;">Your top 3 priorities</h2>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #64748b;">These are the highest-impact areas to fix first.</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${priorityRows}
              </table>

              <p style="margin: 28px 0 0 0; font-size: 15px; line-height: 1.7; color: #334155;">
                Your full report is attached — it has the complete breakdown for all 12 workflow areas, your software stack analysis, and specific next steps.
              </p>

            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 32px 40px; text-align: center;">
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #475569;">
                Want to walk through this together? Book a free 30-minute strategy call and we'll show you exactly where to start.
              </p>
              <a href="${STRATEGY_CALL_URL}" style="display: inline-block; background: #4f46e5; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 50px;">
                Book Your Free Strategy Call
              </a>
              <p style="margin: 20px 0 0 0; font-size: 13px; color: #94a3b8;">No commitment. No sales pitch. Just clarity.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 0 0 0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">WorkflowAudit · Helping small businesses run better</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Team notification email ───────────────────────────────────────────────────

function buildTeamEmail(result: AnalysisResult, answers: SurveyAnswers): string {
  const ownerEmail = String(answers["intro_email"] ?? "—");
  const teamSize = String(answers["intro_size"] ?? "—");

  const topAreas = result.areas
    .filter((a) => a.grade === "Red" || a.grade === "Amber")
    .slice(0, 5)
    .map(
      (a) =>
        `<tr>
          <td style="padding: 8px 12px; font-size: 13px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${a.name}</td>
          <td style="padding: 8px 12px; font-size: 13px; font-weight: 700; color: ${a.grade === "Red" ? "#ef4444" : "#f59e0b"}; border-bottom: 1px solid #f1f5f9;">${a.grade}</td>
          <td style="padding: 8px 12px; font-size: 13px; color: #475569; border-bottom: 1px solid #f1f5f9;">${a.score}/100</td>
          <td style="padding: 8px 12px; font-size: 13px; color: #ef4444; border-bottom: 1px solid #f1f5f9;">${fmt(a.monthlyLeakage)}/mo</td>
        </tr>`
    )
    .join("");

  const { stackSummary: s } = result;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px;">

          <!-- Header -->
          <tr>
            <td style="background: #1e293b; border-radius: 10px 10px 0 0; padding: 24px 32px;">
              <p style="margin: 0 0 2px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8;">Internal — New Audit Submitted</p>
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #f8fafc;">${result.businessName}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background: #ffffff; padding: 32px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">

              <!-- Lead info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="width: 50%; padding: 0 16px 0 0; vertical-align: top;">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8;">Owner</p>
                    <p style="margin: 0; font-size: 15px; font-weight: 600; color: #1e293b;">${result.ownerName}</p>
                  </td>
                  <td style="width: 50%; vertical-align: top;">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8;">Email</p>
                    <p style="margin: 0; font-size: 15px; color: #4f46e5;">${ownerEmail}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 16px 0 0; vertical-align: top;">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8;">Team Size</p>
                    <p style="margin: 0; font-size: 15px; color: #1e293b;">${teamSize} employees</p>
                  </td>
                  <td style="padding: 16px 0 0 0; vertical-align: top;">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8;">Business</p>
                    <p style="margin: 0; font-size: 15px; color: #1e293b;">${String(answers["intro_business"] ?? "—")}</p>
                  </td>
                </tr>
              </table>

              <!-- Scores -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 18px 20px; text-align: center; border-right: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 2px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8;">Health Score</p>
                    <p style="margin: 0; font-size: 32px; font-weight: 800; color: ${gradeColor(result.overallScore)};">${result.overallScore}</p>
                  </td>
                  <td style="padding: 18px 20px; text-align: center; border-right: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 2px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8;">Monthly Leakage</p>
                    <p style="margin: 0; font-size: 32px; font-weight: 800; color: #ef4444;">${fmt(result.totalMonthlyLeakage)}</p>
                  </td>
                  <td style="padding: 18px 20px; text-align: center;">
                    <p style="margin: 0 0 2px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8;">Annual Leakage</p>
                    <p style="margin: 0; font-size: 32px; font-weight: 800; color: #ef4444;">${fmt(result.totalAnnualLeakage)}</p>
                  </td>
                </tr>
              </table>

              <!-- Top areas -->
              <h2 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b;">Worst-Performing Areas</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 28px;">
                <tr style="background: #f8fafc;">
                  <th style="padding: 8px 12px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #94a3b8; border-bottom: 1px solid #e2e8f0;">Area</th>
                  <th style="padding: 8px 12px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #94a3b8; border-bottom: 1px solid #e2e8f0;">Grade</th>
                  <th style="padding: 8px 12px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #94a3b8; border-bottom: 1px solid #e2e8f0;">Score</th>
                  <th style="padding: 8px 12px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #94a3b8; border-bottom: 1px solid #e2e8f0;">Leakage</th>
                </tr>
                ${topAreas}
              </table>

              <!-- Stack summary -->
              <h2 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b;">Stack Summary</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px;">
                <tr>
                  <td style="padding: 14px 16px; text-align: center; border-right: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 2px 0; font-size: 20px; font-weight: 800; color: #3b82f6;">${s.configureCount}</p>
                    <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8;">Configure</p>
                  </td>
                  <td style="padding: 14px 16px; text-align: center; border-right: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 2px 0; font-size: 20px; font-weight: 800; color: #8b5cf6;">${s.connectCount}</p>
                    <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8;">Connect</p>
                  </td>
                  <td style="padding: 14px 16px; text-align: center; border-right: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 2px 0; font-size: 20px; font-weight: 800; color: #ef4444;">${s.replaceCount}</p>
                    <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8;">Replace</p>
                  </td>
                  <td style="padding: 14px 16px; text-align: center;">
                    <p style="margin: 0 0 2px 0; font-size: 20px; font-weight: 800; color: #22c55e;">${s.deployCount}</p>
                    <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8;">Deploy</p>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 28px 0; font-size: 13px; color: #64748b;">Est. implementation: <strong>${s.estimatedImplementationHours}h</strong> · Top issue: ${s.topStackIssue}</p>

              <!-- Pricing tier -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 0;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #3b82f6;">Recommended Tier</p>
                    <p style="margin: 0 0 6px 0; font-size: 17px; font-weight: 700; color: #1e3a8a;">${result.recommendedTier}</p>
                    <p style="margin: 0; font-size: 13px; color: #3b5bdb;">${result.tierRationale}</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #1e293b; border-radius: 0 0 10px 10px; padding: 16px 32px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">Full report attached as PDF · WorkflowAudit internal notification</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Export ───────────────────────────────────────────────────────────────────

export async function sendReportEmails(
  result: AnalysisResult,
  answers: SurveyAnswers,
  pdfBuffer: Buffer
): Promise<void> {
  const ownerEmail = String(answers["intro_email"] ?? "");
  const fromEmail = process.env.RESEND_FROM_EMAIL!;
  const teamEmail = process.env.TEAM_NOTIFICATION_EMAIL!;

  console.log("[email] Starting send — owner:", ownerEmail, "| team:", teamEmail);
  console.log("[email] From:", fromEmail, "| PDF size:", pdfBuffer.byteLength, "bytes");

  if (!ownerEmail) throw new Error("Owner email is missing from survey answers");
  if (!fromEmail) throw new Error("RESEND_FROM_EMAIL env var is not set");
  if (!teamEmail) throw new Error("TEAM_NOTIFICATION_EMAIL env var is not set");

  const [ownerRes, teamRes] = await Promise.all([
    resend.emails.send({
      from: fromEmail,
      to: ownerEmail,
      subject: `Your WorkflowAudit Report is Ready — ${result.businessName}`,
      html: buildOwnerEmail(result),
      attachments: [{ filename: "workflowaudit-report.pdf", content: pdfBuffer }],
    }),
    resend.emails.send({
      from: fromEmail,
      to: teamEmail,
      subject: `New Audit — ${result.businessName} | Score: ${result.overallScore} | Leakage: ${fmt(result.totalMonthlyLeakage)}/mo`,
      html: buildTeamEmail(result, answers),
      attachments: [{ filename: "workflowaudit-report.pdf", content: pdfBuffer }],
    }),
  ]);

  // Resend SDK v2+ returns { data, error } instead of throwing — check explicitly
  if (ownerRes.error) {
    console.error("[email] Owner email failed:", ownerRes.error);
    throw new Error(`Owner email failed: ${JSON.stringify(ownerRes.error)}`);
  }
  if (teamRes.error) {
    console.error("[email] Team email failed:", teamRes.error);
    throw new Error(`Team email failed: ${JSON.stringify(teamRes.error)}`);
  }

  console.log("[email] Both emails sent — owner id:", ownerRes.data?.id, "| team id:", teamRes.data?.id);
}
