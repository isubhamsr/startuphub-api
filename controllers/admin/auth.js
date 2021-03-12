
let adminAuth = {}

adminAuth.signup = (res, req) => {
    try {
        console.log("admin signup");
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message,
          });
    }
}

module.exports = adminAuth