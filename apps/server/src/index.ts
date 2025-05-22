import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import logger from "./middlewares/logger.middleware";
import cors from "cors";

const app = express();

// Configure CORS with proper settings
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://www.canto-store.com",
      "https://canto-store.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(logger);
app.use(express.json());
app.use(cookieParser());

app.use("/api/", routes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
