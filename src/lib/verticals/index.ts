import type { VerticalConfig } from "./types";
import { homeServicesConfig } from "./home-services";
import { propertyMaintenanceConfig } from "./property-maintenance";
import { realEstateConfig } from "./real-estate";
import { medSpaConfig } from "./med-spa";
import { commercialInsuranceConfig } from "./commercial-insurance";
import { b2bSalesConfig } from "./b2b-sales";
import { fitnessWellnessConfig } from "./fitness-wellness";

/**
 * Registry of all supported verticals.
 * Key: the URL slug used in /audit/[vertical].
 * Value: the full VerticalConfig for that vertical.
 *
 * To add a vertical:
 *   1. Create src/lib/verticals/{slug}.ts that exports a VerticalConfig.
 *   2. Import it here and add it to the registry.
 */
export const verticalRegistry: Record<string, VerticalConfig> = {
  "home-services": homeServicesConfig,
  "property-maintenance": propertyMaintenanceConfig,
  "real-estate": realEstateConfig,
  "med-spa": medSpaConfig,
  "commercial-insurance": commercialInsuranceConfig,
  "b2b-sales": b2bSalesConfig,
  "fitness-wellness": fitnessWellnessConfig,
};
