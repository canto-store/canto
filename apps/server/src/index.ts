import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import loggerMiddleware from "./middlewares/logger.middleware";

import { checkESConnection } from "./config/elasticsearch";

const app: Express = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
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

app.use(loggerMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.use(errorHandler);

const PORT: number = parseInt(process.env.PORT || "8000", 10);

async function startServer() {
  try {
    const esConnected = await checkESConnection();

    if (esConnected) {
      console.log("Elasticsearch connection verified.");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      if (!esConnected) {
        console.warn(
          "Reminder: Elasticsearch is not connected. Search features will not work."
        );
      }
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

startServer();
