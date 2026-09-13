export type AffiliateNetwork = "shein" | "shopee" | "tiktok-shop";

export type AffiliateNetworkConfig = {
  id: AffiliateNetwork;
  label: string;
  envKey: string;
  domains: string[];
};

export type AffiliateUrlValidation = {
  valid: boolean;
  domainVerified: boolean;
  reason?: "invalid-url" | "insecure-protocol" | "unsupported-network";
  network?: AffiliateNetworkConfig;
};

export const affiliateNetworks: AffiliateNetworkConfig[] = [
  { id: "shein", label: "SHEIN", envKey: "AFFILIATE_SHEIN_TOKEN", domains: ["shein.com", "onelink.shein.com"] },
  { id: "shopee", label: "Shopee", envKey: "AFFILIATE_SHOPEE_TOKEN", domains: ["shopee.com.br", "shope.ee"] },
  { id: "tiktok-shop", label: "TikTok Shop", envKey: "AFFILIATE_TIKTOK_TOKEN", domains: ["tiktok.com", "shop.tiktok.com"] },
];

export function detectAffiliateNetwork(url: string): AffiliateNetworkConfig | undefined {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return affiliateNetworks.find((network) =>
      network.domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`)),
    );
  } catch {
    return undefined;
  }
}

export function getConfiguredNetworks() {
  return affiliateNetworks.filter((network) => Boolean(process.env[network.envKey]));
}

export function validateAffiliateUrl(url: string): AffiliateUrlValidation {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return { valid: false, domainVerified: false, reason: "insecure-protocol" };
    const network = detectAffiliateNetwork(url);
    if (!network) return { valid: false, domainVerified: false, reason: "unsupported-network" };
    return { valid: true, domainVerified: true, network };
  } catch {
    return { valid: false, domainVerified: false, reason: "invalid-url" };
  }
}

export function isAllowedAffiliateUrl(url: string) {
  return validateAffiliateUrl(url).valid;
}