import config from "../config/config.js";

const cookieExpiry = parseInt(config.JWT_EXPIRY);

const cookieOptions = {
    expires: new Date(Date.now() + cookieExpiry * 24 * 60 * 60 * 1000),
    httpOnly: true,
}

export default cookieOptions;
