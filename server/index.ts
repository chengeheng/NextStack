import next from "next";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import session from "express-session";

import passport from "./middlewares/passport-local";
import * as config from "./config/index";

const { databaseConfig } = config;
const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, turbo: true });
// without getRequestHandler() it will throw error
const handle = app.getRequestHandler();

const mongoHost = `mongodb://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.host}:${databaseConfig.port}/${databaseConfig.database}`;
mongoose
  .connect(mongoHost, {
    authSource: "admin",
  })
  .then(() => {
    console.log("connect established: ", mongoHost);
  })
  .catch((err) => {
    console.log("connect error: ", err);
  });

app.prepare().then(() => {
  const server = express();

  // express config
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());
  server.use(cookieParser());

  server.use(
    session({
      secret: config.JWT_KEY,
      resave: false,
      saveUninitialized: true,
    })
  );

  // passport
  server.use(passport.initialize());
  // server.use(passport.session());

  server.use((req, res, next) => {
    req.passport = passport;
    next();
  });

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use("/api/test", (req, res) => {
    res.json({ message: "Hello from the API!" });
  });
  server.use((req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log("server is running on port 3000");
  });
});
