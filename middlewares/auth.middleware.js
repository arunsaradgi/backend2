const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, "fullstack");
      if (decoded) {
        req.body.userId = decoded.userId;
        req.body.user = decoded.user;
        next();
      } else {
        res.json({ msg: "not authorized" });
      }
    } catch (error) {
      res.json({ err: error.message });
    }
  } else {
    res.status(400).json({ msg: "please login" });
  }
};

module.exports = {
  auth,
};
