const jwt = require("jsonwebtoken");

exports.authCheck = (req, res, next) => {
  const { authtoken } = req.headers;
  // const authtoken = req.cookies.authtoken;

  if (authtoken) {
    jwt.verify(authtoken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "you are unauthorized " });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    console.log("you are unauthorized ");
    res.json({ message: "you are unauthorized" });
  }
};
