import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_BASE_URL = "https://api.nasa.gov/neo/rest/v1";

export const nasaService = {
  async getAsteroidsFeed(startDate: string, endDate: string) {
    if (!NASA_API_KEY) {
      throw new Error("NASA API key is not configured");
    }

    const response = await axios.get(
      `${NASA_BASE_URL}/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`
    );
    return response.data;
  },
};
