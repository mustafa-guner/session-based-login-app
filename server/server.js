const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const bp = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const UsersRoute = require("./Routes/users");

dotenv.config({
  path: path.join(__dirname, "/Config/dotenv/.env"),
});

const PORT = process.env.PORT || 3200;
const app = express();

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => console.log("Connected to database."))
  .catch((err) => console.log(err));

//setting the connect mongodb session store
const mongoDBstore = new MongoDBStore({
  uri: process.env.DB_CONNECT,
  collection: "mySessions",
});

app.use(bp.json());
app.use(express.json());
app.use(bp.urlencoded({ extended: false }));

//Express session
const MAX_AGE = 1000 * 60 * 60 * 3; // Three hours
const { COOKIE_NAME, SESSION_SECRET, NODE_ENV } = process.env;
app.use(
  session({
    name: COOKIE_NAME,
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: mongoDBstore,
    cookie: {
      maxAge: MAX_AGE, //3 hrs
      sameSite: false,
      secure: NODE_ENV === "development" ? false : true, //If env = dev HTTP can be used but if env = prd HTTPS should be used
    },
  })
);
app.use(cors());

app.use("/api/v1/auth", UsersRoute);

app.listen(PORT, () =>
  console.log(
    `Server is listening on PORT:${PORT} | Node Environment: ${NODE_ENV}`
  )
);
