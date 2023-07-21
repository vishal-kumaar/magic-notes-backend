import config from "./config.js";
import CustomError from "../utils/CustomError.js";

const corsConfig = (req, callback) => {
    const origin = req.get('Origin');
    if (!origin || config.ALLOWED_ORIGINS.includes(origin)){
        callback(null, true);
    }
    else{
        callback(new CustomError('Not allowed by CORS', 403))
    }
}

export default corsConfig;