import { Suspense } from "react";
import { redirect } from "next/navigation";
import { verticalRegistry } from "@/lib/verticals";
import type { VerticalConfig } from "@/lib/verticals/types";
import VerticalSurvey from "./VerticalSurvey";

interface Props {
  params: Promise<{ vertical: string }>;
}

export default async function VerticalAuditPage({ params }: Props) {
  const { vertical } = await params;
  const config: VerticalConfig | undefined = verticalRegistry[vertical];

  if (!config) {
    redirect("/audit");
  }

  return (
    <Suspense>
      <VerticalSurvey config={config} />
    </Suspense>
  );
}
