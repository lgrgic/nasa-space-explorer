import { Request, Response } from "express";
import { nasaService } from "../services/nasaService";
import { aiAnalysisService } from "../services/aiAnalysisService";
import { AsteroidFeedParams } from "../middleware/validation";

// set cache headers
const setCacheHeaders = (res: Response, maxAge: number, etag: string) => {
  res.setHeader("Cache-Control", `public, max-age=${maxAge}`);
  res.setHeader("ETag", etag);
  res.setHeader("Last-Modified", new Date().toUTCString());
  console.log(`Cache: max-age=${maxAge}, etag=${etag}`);
};

// prevent caching
const setNoCacheHeaders = (res: Response) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
};

export const nasaController = {
  async getAsteroidsFeed(req: Request, res: Response): Promise<void> {
    console.log("🎯 getAsteroidsFeed controller called!"); // Debug log
    try {
      const { start_date, end_date, page, limit } = (req as any)
        .validatedQuery as AsteroidFeedParams;

      const data = await nasaService.getAsteroidsFeed(start_date, end_date);

      const allAsteroids = Object.values(data.near_earth_objects).flat();
      const totalAsteroids = allAsteroids.length;
      const totalPages = Math.ceil(totalAsteroids / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedAsteroids = allAsteroids.slice(startIndex, endIndex);

      const result = {
        ...data,
        near_earth_objects: { [start_date]: paginatedAsteroids },
        pagination: {
          currentPage: page,
          totalPages,
          totalAsteroids,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit,
        },
      };

      // cache headers for browser caching
      setCacheHeaders(
        res,
        3600,
        `"asteroids-feed-${start_date}-${end_date}-${page}-${limit}"`
      );

      res.json(result);
    } catch (error) {
      console.error("Asteroids API error:", error);
      res.status(500).json({
        error: "Failed to fetch asteroids data",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },

  async getAsteroidById(req: Request, res: Response): Promise<void> {
    try {
      const { asteroid_id } = (req as any).validatedQuery as {
        asteroid_id: string;
      };

      const data = await nasaService.getAsteroidById(asteroid_id);

      // cache headers for browser caching
      setCacheHeaders(res, 86400, `"asteroid-${asteroid_id}"`);

      res.json(data);
    } catch (error) {
      console.error("Asteroid lookup error:", error);
      res.status(500).json({
        error: "Failed to fetch asteroid data",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },

  async clearCache(req: Request, res: Response): Promise<void> {
    try {
      nasaService.clearCache();

      // prevent caching of response
      setNoCacheHeaders(res);

      res.json({ message: "Cache cleared successfully" });
    } catch (error) {
      console.error("Cache clear error:", error);
      res.status(500).json({
        error: "Failed to clear cache",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },

  async analyzeAsteroid(req: Request, res: Response): Promise<void> {
    try {
      const { asteroid_id } = (req as any).validatedQuery as {
        asteroid_id: string;
      };

      const asteroidData = await nasaService.getAsteroidById(asteroid_id);
      const analysis = await aiAnalysisService.analyzeAsteroid(asteroidData);

      // cache headers for browser caching
      setCacheHeaders(res, 1800, `"asteroid-analysis-${asteroid_id}"`);

      res.json({
        asteroid: asteroidData,
        analysis,
      });
    } catch (error) {
      console.error("Asteroid analysis error:", error);
      res.status(500).json({
        error: "Failed to analyze asteroid",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
};
