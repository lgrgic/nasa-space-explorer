import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { nasaRoutes } from "./routes/nasaRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { xssProtection } from "./middleware/xssProtection";
import { securityHeaders } from "./middleware/securityHeaders";

dotenv.config();

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP",
});

app.use(limiter);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(xssProtection);
app.use(securityHeaders);

app.use("/api/nasa", nasaRoutes);
app.get("/api/health", (_req, res) => res.status(200).send("ok"));

app.use(errorHandler);

export default app;
