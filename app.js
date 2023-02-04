import express from "express";
import userRoute from "./routes/user.route.js";
import noteRoute from "./routes/note.route.js";
import cookieParsar from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import {fileURLToPath} from 'url';
import config from "./config/config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParsar());
app.use(morgan("tiny"));

app.use("/api/auth", userRoute);
app.use("/api/note", noteRoute);

if (config.NODE_ENV){
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use(express.static(path.join(__dirname, "./frontend")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "./frontend/index.html"));
    })
}

export default app;