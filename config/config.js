import dotenv from "dotenv";
dotenv.config();

const config = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    SMTP_SERVICE: process.env.SMTP_SERVICE,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_EMAIL: process.env.SMTP_EMAIL,
    NODE_ENV: process.env.NODE_ENV
}

export default config;