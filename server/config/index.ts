export const JWT_KEY = "node-admin-jwt";
export const JWT_EXPIRY = 30 * 60 * 1000; // half an hour
export const JWT_AUDIENCE = "RMS_XH";
export const JWT_ALG = "HS256";
export const JWT_ISSUER = "RMS";

// mongo config
export const databaseConfig = {
  host: "localhost",
  port: "27017",
  database: "next",
  username: "admin",
  password: "123456",
};
