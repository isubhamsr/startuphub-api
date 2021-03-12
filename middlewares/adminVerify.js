const jwt = require("jsonwebtoken");

let adminVerify = {};

adminVerify.isSuperAdmin = (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({
        error: true,
        message: "You need to login",
      });
    }

    try {
      jwt.verify(
        token,
        process.env.SUPER_SECRET_KEY,
        function (error, decoded) {
          if (error) {
            return res.status(401).json({
              error: true,
              message: "Invalid token",
            });
          }
          if (!decoded.isSuperAdmin) {
            return res.status(401).json({
              error: true,
              message: "You are not a Super Admin",
            });
          }

          req.superAdmin = decoded;
          next();
        }
      );
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

adminVerify.isAdmin = (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({
        error: true,
        message: "You need to login",
      });
    }

    try {
      jwt.verify(
        token,
        process.env.SUPER_SECRET_KEY,
        function (error, decoded) {
          if (error) {
            return res.status(401).json({
              error: true,
              message: "Invalid token",
            });
          }
          if (!decoded.isAdmin) {
            return res.status(401).json({
              error: true,
              message: "You are no an Admin",
            });
          }

          req.admin = decoded;
          next();
        }
      );
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = adminVerify;