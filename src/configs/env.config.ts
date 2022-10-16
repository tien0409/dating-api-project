export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  database: {
    uri: process.env.DATABASE_URI,
    name: process.env.DATABASE_DB_NAME,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN, 10),
  },
});
