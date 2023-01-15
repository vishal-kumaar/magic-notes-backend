import transporter from "../config/transporter.config";
import config from "../config/config";

const mailSender = async(options) => {
    const message = {
        from: config.SMTP_EMAIL,
        to: options.email,
        subject: options.subject,
        text: options.text,
    }

    await transporter.sendMail(message);
}

export default mailSender;