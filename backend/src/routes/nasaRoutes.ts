import { Router } from "express";
import { nasaController } from "../controllers/nasaController";

const router = Router();

router.get("/asteroids/feed", nasaController.getAsteroidsFeed);
router.get("/asteroids/:asteroid_id", nasaController.getAsteroidById);

export { router as nasaRoutes };
