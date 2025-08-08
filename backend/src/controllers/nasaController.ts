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
    console.log("getAsteroidsFeed controller");
    try {
      const {
        start_date,
        end_date,
        page,
        limit,
        hazard,
        distance,
        size,
        velocity,
      } = (req as any).validatedQuery as AsteroidFeedParams & {
        hazard?: "all" | "hazardous" | "safe";
        distance?: "all" | "close" | "medium" | "far";
        size?: "all" | "small" | "medium" | "large";
        velocity?: "all" | "slow" | "medium" | "fast";
      };

      const data = await nasaService.getAsteroidsFeed(start_date, end_date);

      const allAsteroids: any[] = Object.values(data.near_earth_objects).flat();

      const filtered = allAsteroids.filter((a: any) => {
        const approach = a.close_approach_data?.[0];
        if (!approach) return false;

        // hazard
        if (hazard === "hazardous" && !a.is_potentially_hazardous_asteroid)
          return false;
        if (hazard === "safe" && a.is_potentially_hazardous_asteroid)
          return false;

        // distance (lunar)
        if (distance && distance !== "all") {
          const lunar = parseFloat(approach.miss_distance.lunar);
          if (distance === "close" && !(lunar < 1)) return false;
          if (distance === "medium" && !(lunar >= 1 && lunar <= 5))
            return false;
          if (distance === "far" && !(lunar > 5)) return false;
        }

        // size (km max diameter)
        if (size && size !== "all") {
          const km = a.estimated_diameter.kilometers.estimated_diameter_max;
          if (size === "small" && !(km < 0.1)) return false;
          if (size === "medium" && !(km >= 0.1 && km <= 1)) return false;
          if (size === "large" && !(km > 1)) return false;
        }

        // velocity (km/s)
        if (velocity && velocity !== "all") {
          const v = parseFloat(
            approach.relative_velocity.kilometers_per_second
          );
          if (velocity === "slow" && !(v < 10)) return false;
          if (velocity === "medium" && !(v >= 10 && v <= 20)) return false;
          if (velocity === "fast" && !(v > 20)) return false;
        }

        return true;
      });
      const totalAsteroids = filtered.length;
      const totalPages = Math.ceil(totalAsteroids / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedAsteroids = filtered.slice(startIndex, endIndex);

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
        `"asteroids-feed-${start_date}-${end_date}-${page}-${limit}-${
          hazard ?? "all"
        }-${distance ?? "all"}-${size ?? "all"}-${velocity ?? "all"}"`
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
