const express = require("express");
const userRouter = express.Router();
const User = require("../Models/User");
const { authenticate } = require("../Middlewares/auth");

userRouter.get("/users", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json({
      success: true,
      users: users,
    });
  } catch (err) {
    return res.json({
      success: false,
      error: err.message,
    });
  }
});

userRouter.post("/register", (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields." });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) return res.status(400).json({ msg: "User is already exists!" });

      const newUser = new User({
        name,
        email,
        password,
      });

      newUser
        .save()
        .then(() => {
          return res.json({
            success: true,
            msg: "Succesfuly registered",
          });
        })
        .catch((err) => {
          return res.json({
            success: false,
            msg: err.message,
          });
        });
    })
    .catch((err) => {
      return res.json({
        success: false,
        msg: err.message,
      });
    });
});

userRouter.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email: email }).then((user) => {
    if (!user) return res.json({ success: false, msg: "User is not found" });

    if (user.comparePasswords(password)) {
      const sessionUser = { id: user.id, name: user.name, email: user.email };
      req.session.user = sessionUser;
      return res.json({
        success: true,
        msg: `Welcome back! ${user.name}`,
        sessionUser,
      });
    }
  });
});

userRouter.delete("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.clearCookie("_session");
    res.send("Logged out succesfully!");
  });
});

userRouter.get("/home", authenticate, (req, res, next) => {
  res.json({
    success: true,
    msg: `Home page route worked ${req.session.user.name}`,
  });
});

module.exports = userRouter;
