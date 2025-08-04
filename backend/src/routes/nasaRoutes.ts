import { Router } from "express";
import { nasaController } from "../controllers/nasaController";
import {
  validateAsteroidFeed,
  validateAsteroidId,
} from "../middleware/validation";

const router = Router();

router.get(
  "/asteroids/feed",
  validateAsteroidFeed,
  nasaController.getAsteroidsFeed
);
router.get(
  "/asteroids/:asteroid_id",
  validateAsteroidId,
  nasaController.getAsteroidById
);

router.get(
  "/asteroids/:asteroid_id/analyze",
  validateAsteroidId,
  nasaController.analyzeAsteroid
);

router.delete("/cache", nasaController.clearCache);

export { router as nasaRoutes };
