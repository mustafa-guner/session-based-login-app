module.exports = {
  authenticate: (req, res, next) => {
    if (req.session.user) {
      return next();
    } else {
      res.status(401).json({
        success: false,
        msg: "You are not authorized!",
      });
    }
  },
};
