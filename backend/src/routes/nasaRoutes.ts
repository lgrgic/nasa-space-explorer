import { Router } from "express";
import { nasaController } from "../controllers/nasaController";

const router = Router();

router.get("/asteroids/feed", nasaController.getAsteroidsFeed);

export { router as nasaRoutes };
