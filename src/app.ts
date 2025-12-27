import express from "express";
import userRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

app.use(express.json());
app.use("/authentication", userRoutes);
app.use("/orders", orderRoutes)

export default app;
