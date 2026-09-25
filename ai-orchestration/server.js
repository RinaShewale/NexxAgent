import "dotenv/config";
import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

if (!process.env.MISTRAL_API_KEY) {
  console.warn("MISTRAL_API_KEY is not configured; /api/ai/invoke will fail until it is set.");
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});