express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const KnexSessionStore = require("connect-session-knex")(session);

dbConnection = require("../data/dbConfig.js");
const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");

// const configureMiddleware = require("./configure-middleware.js");

const server = express();

const sessionConfig = {
  name: "victoria",
  secret: process.env.SESSION_SECRET || "no les dicen",
  cookie: {
    maxAge: 1000 * 30 * 20,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 60000
  })
};
// configureMiddleware(server);
server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});
module.exports = server;
