import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 600,
  useClones: false,
});

export const cacheService = {
  get<T>(key: string): T | undefined {
    return cache.get<T>(key);
  },

  set<T>(key: string, value: T, ttl?: number): boolean {
    return cache.set(key, value, ttl || 3600);
  },

  del(key: string): number {
    return cache.del(key);
  },

  flush(): void {
    cache.flushAll();
  },

  generateKey(prefix: string, ...params: string[]): string {
    return `${prefix}:${params.join(":")}`;
  },
};

export const CACHE_KEYS = {
  ASTEROID_FEED: "feed",
  ASTEROID_DETAIL: "asteroid",
} as const;
