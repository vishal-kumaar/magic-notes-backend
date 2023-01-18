import express from "express";
import userRoute from "./routes/user.route";
import todoRoute from "./routes/todo.route";
import cookieParsar from "cookie-parser";
import cors from "cors";
import morgan from "morgan"

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParsar());
app.use(morgan("tiny"));
app.use("/", userRoute);
app.use("/", todoRoute);

export default app;