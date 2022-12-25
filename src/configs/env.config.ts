export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  clientURL: process.env.CLIENT_URL,
  database: {
    uri: process.env.DATABASE_URI,
    name: process.env.DATABASE_DB_NAME,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessExpiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN, 10),
    refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN, 10),
    mailExpiresIn: parseInt(process.env.JWT_MAIL_EXPIRES_IN, 10),
  },
  mailer: {
    host: process.env.MAILER_HOST,
    port: parseInt(process.env.MAILER_PORT, 10),
    username: process.env.MAILER_USERNAME,
    password: process.env.MAILER_PASSWORD,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    currency: process.env.STRIPE_CURRENCY,
  },
});
