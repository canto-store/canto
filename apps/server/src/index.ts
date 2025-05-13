import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import logger from "./middlewares/logger.middleware";
import cors from "cors";

const app = express();

app.use(cors());
app.use(logger); // Log all API requests
app.use(express.json());
app.use(cookieParser());

app.use("/api/", routes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
