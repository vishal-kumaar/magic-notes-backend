import express from "express";
import userRoute from "./routes/user.route.js";
import noteRoute from "./routes/note.route.js";
import cookieParsar from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import corsConfig from "./config/cors.config.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsConfig));
app.use(cookieParsar());
app.use(morgan("tiny"));

app.use("/api/auth", userRoute);
app.use("/api/note", noteRoute);

export default app;