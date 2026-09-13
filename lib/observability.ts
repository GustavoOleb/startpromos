export type CardinalEventName =
  | "search"
  | "filter"
  | "product_view"
  | "affiliate_click"
  | "save_offer"
  | "empty_results";

export type CardinalEvent = {
  name: CardinalEventName;
  route: string;
  productSlug?: string;
  network?: string;
  filter?: string;
  queryLength?: number;
};

const MAX_ROUTE_LENGTH = 200;

export function sanitizeCardinalEvent(event: CardinalEvent): CardinalEvent {
  return {
    name: event.name,
    route: event.route.slice(0, MAX_ROUTE_LENGTH),
    ...(event.productSlug ? { productSlug: event.productSlug.slice(0, 120) } : {}),
    ...(event.network ? { network: event.network.slice(0, 40) } : {}),
    ...(event.filter ? { filter: event.filter.slice(0, 80) } : {}),
    ...(event.queryLength !== undefined && Number.isInteger(event.queryLength) && event.queryLength >= 0
      ? { queryLength: Math.min(event.queryLength, 200) }
      : {}),
  };
}

export function cardinalSloTargets() {
  return {
    pageAvailability: 99.9,
    affiliateLinkHealth: 99,
    importValidationSuccess: 99,
    maxPriceAgeHours: 24,
  } as const;
}