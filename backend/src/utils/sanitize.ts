export const scrubUrlApiKey = (url?: string): string | undefined => {
  if (!url) return url;
  try {
    const u = new URL(url);
    u.searchParams.delete("api_key");
    return u.toString();
  } catch {
    return url;
  }
};

export const scrubLinksMap = (links?: Record<string, unknown>) => {
  if (!links || typeof links !== "object") return links as any;
  const entries = Object.entries(links).map(([k, v]) => [
    k,
    scrubUrlApiKey(String(v)),
  ]);
  return Object.fromEntries(entries);
};

export const deepScrubApiKeys = <T>(value: T): T => {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    return scrubUrlApiKey(value) as any;
  }
  if (Array.isArray(value)) {
    return (value as any).map((v: any) => deepScrubApiKeys(v)) as any;
  }
  if (typeof value === "object") {
    const result: Record<string, any> = {};
    for (const [k, v] of Object.entries(value as any)) {
      result[k] = deepScrubApiKeys(v);
    }
    return result as any;
  }
  return value;
};

export const scrubNeoItem = (neo: any) => {
  if (!neo || typeof neo !== "object") return neo;
  // scrub any URL-like strings (sentry_data, links, etc)
  const next = deepScrubApiKeys(neo);
  if (next?.links?.self) {
    next.links = {
      ...next.links,
      self: scrubUrlApiKey(String(next.links.self)),
    };
  }
  return next;
};
