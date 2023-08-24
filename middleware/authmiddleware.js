const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (!token) {
      return res
        .status(500)
        .json({ msg: "These is authenticated route token required" });
    } else {
      var decoded = jwt.verify(token, process.env.secrate);
      req.body.userID = decoded.userID;
      req.body.username = decoded.username;

      next();
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { auth };
