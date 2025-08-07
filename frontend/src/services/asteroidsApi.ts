import axios from "axios";
import type { AsteroidsResponse } from "../types/asteroids";

const API_BASE_URL = "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const cache = new Map<string, { data: AsteroidsResponse; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const asteroidsApi = {
  getFeed: async (
    startDate: string,
    endDate: string,
    page: number = 1,
    limit: number = 9
  ): Promise<AsteroidsResponse> => {
    const cacheKey = `${startDate}-${endDate}-${page}-${limit}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const response = await api.get(
      `/nasa/asteroids/feed?start_date=${startDate}&end_date=${endDate}&page=${page}&limit=${limit}`
    );

    cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    return response.data;
  },

  getAsteroidById: async (asteroidId: string) => {
    const response = await api.get(`/nasa/asteroids/${asteroidId}`);
    return response.data;
  },

  analyzeAsteroid: async (asteroidId: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/nasa/asteroids/${asteroidId}/analyze`,
        {
          timeout: 60000,
        }
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};
