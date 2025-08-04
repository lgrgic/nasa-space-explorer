import axios from "axios";
import * as dotenv from "dotenv";
import { cacheService, CACHE_KEYS } from "./cacheService";

dotenv.config();

const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_BASE_URL = "https://api.nasa.gov/neo/rest/v1";

export const nasaService = {
  async getAsteroidsFeed(startDate: string, endDate: string) {
    if (!NASA_API_KEY) {
      throw new Error("NASA API key is not configured");
    }

    const cacheKey = cacheService.generateKey(
      CACHE_KEYS.ASTEROID_FEED,
      startDate,
      endDate
    );
    const cachedData = cacheService.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await axios.get(
      `${NASA_BASE_URL}/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`
    );

    cacheService.set(cacheKey, response.data, 3600);
    return response.data;
  },

  async getAsteroidById(asteroidId: string) {
    if (!NASA_API_KEY) {
      throw new Error("NASA API key is not configured");
    }

    const cacheKey = cacheService.generateKey(
      CACHE_KEYS.ASTEROID_DETAIL,
      asteroidId
    );
    const cachedData = cacheService.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await axios.get(
      `${NASA_BASE_URL}/neo/${asteroidId}?api_key=${NASA_API_KEY}`
    );

    cacheService.set(cacheKey, response.data, 86400);
    return response.data;
  },

  clearCache(): void {
    cacheService.flush();
  },
};
