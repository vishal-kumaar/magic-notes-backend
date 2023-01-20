import nodemailer from "nodemailer";
import config from "./config.js";

const transporter = nodemailer.createTransport({
    service: config.SMTP_SERVICE,
    auth: {
        user: config.SMTP_USERNAME,
        pass: config.SMTP_PASSWORD,
    },
});

export default transporter;