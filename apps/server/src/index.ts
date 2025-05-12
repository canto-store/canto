import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/", routes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
