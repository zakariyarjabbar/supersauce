// Verified public URL from this repository's GitHub homepage setting.
export const DEFAULT_SITE_ORIGIN = "https://supersauce-rho.vercel.app";

export function resolveSiteOrigin({
  siteUrl,
  productionUrl,
  deploymentUrl,
}: {
  siteUrl?: string;
  productionUrl?: string;
  deploymentUrl?: string;
} = {}) {
  const value = [siteUrl, productionUrl, deploymentUrl].find((item) => item?.trim())?.trim();
  if (!value) return DEFAULT_SITE_ORIGIN;
  const url = new URL(value.includes("://") ? value : `https://${value}`);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password)
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be a public HTTP or HTTPS origin without credentials.",
    );
  return url.origin;
}
