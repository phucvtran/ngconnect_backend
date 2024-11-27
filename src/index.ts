// src/index.ts
import express, { Express } from "express";
import cors from "cors";
import "dotenv/config";

import sequelize from "./config/dbConnection";
import { ErrorHandler } from "./middlewares/ErrorHandler";
import UserRoutes from "./routes/UserRoutes";
import ListingRoutes from "./routes/ListingRoutes";
import config from "./config/config";

(async () => {
  console.log("connect DB and created table");
  await sequelize.sync();
  // await sequelize.sync({ alter: true });
})();
const app: Express = express();
const port = process.env.PORT || 8080;

app.use(cors(config.corsOptions));

app.use(express.json());

//apply routes
app.use("/api/users", UserRoutes);

app.use("/api/", ListingRoutes);

// Error Handling Middleware (Always at the end)
app.use(ErrorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at port: ${port}`);
});
