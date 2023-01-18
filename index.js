import app from "./app";
import mongoose from "mongoose";
import config from "./config/config";

const port = config.PORT;

(async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        console.log("Database connected");

        app.on('error', (error) => {
            throw error;
        });

        app.listen(port, () => {
            console.log(`App is running on http://localhost:${port}`);
        });
    } catch (error) {
        throw error;
    }
})();