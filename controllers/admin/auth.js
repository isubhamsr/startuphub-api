const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

let adminAuth = {};

adminAuth.superAdminsSignup = (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      gender,
      isSuperAdmin,
      isAdmin,
      isModerator,
      isStuff,
    } = req.body;

    if (!name || !username || !email || !password) {
      return res
        .status(401)
        .json({ error: true, message: "Please fill all feilds" });
    }

    User.find({ isSuperAdmin: true }, { _id: 0, email: 1, username: 1 })
      .then((userDetails) => {
        if (userDetails.length === 5) {
          return res.status(401).json({
            error: true,
            message: "There already has Five Super admin",
          });
        }

        if (userDetails.length >= 1) {
          for (let i = 0; i < userDetails.length; i++) {
            if (
              userDetails[i].email === email ||
              userDetails[i].username === username
            ) {
              return res.status(401).json({
                error: true,
                message: "This Email or Username already exist",
              });
            }
          }
        }

        const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
        const hash = bcrypt.hashSync(password, salt);

        const user = new User({
          name: name,
          username: username,
          email: email,
          password: hash,
          gender: gender,
          uniqueId: Date.now(),
          isSuperAdmin: isSuperAdmin,
          isAdmin: isAdmin,
          isModerator: isModerator,
          isStuff: isStuff,
        });

        user
          .save()
          .then((userDetails) => {
            const token = jwt.sign(
              {
                _id: userDetails._id,
                name: userDetails.name,
                uniqueId: userDetails.uniqueId,
                email: userDetails.email,
                username: userDetails.username,
                isActive: userDetails.isActive,
                isSuperAdmin: userDetails.isSuperAdmin,
                isAdmin: userDetails.isAdmin,
                isModerator: userDetails.isModerator,
                isStuff: userDetails.isStuff,
              },
              process.env.SUPER_SECRET_KEY
            );

            // const link =
            //   process.env.PRODUCTION === "true"
            //     ? `${process.env.APP_HOST}${process.env.APP_VERSION}/emailverify?token=${token}`
            //     : `${process.env.APP_HOST}:${process.env.PORT}${process.env.APP_VERSION}/emailverify?token=${token}`;
            // console.log(link);

            // mailer.email(
            //   { name: name, link: link },
            //   email,
            //   "verifyUser.ejs",
            //   "Email Verification",
            //   (info) => {}
            // );

            return res.status(200).json({
              error: false,
              message: "Super Admin Added sucesfully",
              token: token,
            });
          })
          .catch((error) => {
            return res.status(500).json({
              error: true,
              message: error.message,
            });
          });
      })
      .catch((error) => {
        return res.status(500).json({
          error: true,
          message: error.message,
        });
      });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

adminAuth.superAdminSignin = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return res
        .status(401)
        .json({ error: true, message: "Please fill all feilds" });
    }

    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res
            .status(401)
            .json({ error: true, message: "Wrong email id" });
        }

        if (!user.isActive) {
          return res.status(401).json({
            error: true,
            message: "You might be ban. Please contact to Admin",
          });
        }

        const matchPassword = bcrypt.compareSync(password, user.password);
        if (!matchPassword) {
          return res
            .status(401)
            .json({ error: true, message: "wrong password" });
        }
        const token = jwt.sign(
          {
            _id: user._id,
            name: user.name,
            uniqueId: user.uniqueId,
            email: user.email,
            username: user.username,
            isActive: user.isActive,
            isSuperAdmin: user.isSuperAdmin,
            isAdmin: user.isAdmin,
            isModerator: user.isModerator,
            isStuff: user.isStuff,
            isStudent: user.isStudent,
            isWorkingPerson: user.isWorkingPerson,
            isPropertyOwner: user.isPropertyOwner,
          },
          process.env.SUPER_SECRET_KEY
        );
        User.findByIdAndUpdate(
          { _id: user._id },
          { $set: { token: token } },
          { new: true, useFindAndModify: false }
        )
          .then((userDetails) => {
            return res.status(200).json({
              error: false,
              message: "Super Admin Signin Succesfully",
              token: token,
            });
          })
          .catch((error) => {
            return res.status(500).json({
              error: true,
              message: error.message,
            });
          });
      })
      .catch((error) => {
        return res.status(500).json({
          error: true,
          message: error.message,
        });
      });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

adminAuth.verifyUserToken = (req, res) => {
  try {
    const { id } = req.params;

    try {
      User.findById({ _id: id }, { token: 1, _id: 0 })
        .then((response) => {
          return res.status(200).json({
            error: false,
            message: "User Token Verified",
            data: response,
          });
        })
        .catch((error) => {
          return res.status(500).json({
            error: true,
            message: error.message,
          });
        });
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

adminAuth.logout = (req, res) => {
  try {
    const { id } = req.params;

    User.findByIdAndUpdate(
      { _id: id },
      { $set: { token: "" } },
      { new: true, useFindAndModify: false }
    )
      .then(() => {
        return res.status(200).json({
          error: false,
          message: "LogOut Successfull",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          error: true,
          message: error.message,
        });
      });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = adminAuth;
