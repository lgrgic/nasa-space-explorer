import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "NASA Space Explorer API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
