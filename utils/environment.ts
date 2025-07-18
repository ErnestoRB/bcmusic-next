export const { CLIENT_ID } = process.env;
export const { CLIENT_SECRET } = process.env;
export const { DATABASE_HOST } = process.env;
export const { DATABASE_PORT } = process.env;
export const { DATABASE_PASS } = process.env;
export const { DATABASE_USER } = process.env;
export const { DATABASE_NAME } = process.env;
export const { RECAPTCHA_SECRET } = process.env;
export const { DATABASE_URL } = process.env;
export const { GMAIL_ADDRESS } = process.env;
export const { GMAIL_PASS } = process.env;

export const { ORS_APIKEY } = process.env;

export const { NEXT_PUBLIC_RECAPTCHA_CLIENT } = process.env;
export const IS_DEVELOPMENT = process.env["NODE_ENV"] === "development";

export const SPOTIFY_SCOPES = "user-top-read";
export const SPOTIFY_REDIRECT_ID = "http://localhost:8888/api/callback";
