const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;

const jwt = require("jsonwebtoken");


const User = require("../models/user.model");


const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) token = req.cookies["token"];
  return token;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: "asjkdbv9238r4jvdsb",
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload._id);

      if (!user) return done(null, false);

      return done(null, user);
    } catch (error) {
      console.log("Error in passport.use() in auth.controller.js file");
      console.error(error);
      return done(error, false);
    }
  })
);

const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ serverMsg: "Internal server error" });
    }

    if (!user) {
      return res.status(401).json({ serverMsg: "Unauthorized" });
    }

    req.user = user;
    next();
  })(req, res, next);
};

const sendVerificationEmail = async (email, password, name) => {
  try {
    

    

    await User.create({
      name,
      email,
      password,
    });
  } catch (error) {
    console.log("Error in sendVerificationEmail() in auth.controller.js file");
    console.error(error);
  }
};

const verifyEmail = async (req, res) => {
  console.log("- - - - - - - - - - - - - - - -");
  console.log("started verifyEmail() in auth.controller.js file");
  try {
    const { token } = req.query;
    const { name, email, password } = jwt.verify(token, "asjkdbv9238r4jvdsb");

    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user)
      return res.status(400).json({ serverMsg: "Error creating account" });

    return res
      .status(200)
      .json({
        serverMsg: "Email verified successfully, you can now proceed to login",
        user,
      });
  } catch (error) {
    console.log("Error in verifyEmail() in auth.controller.js file");
    console.error(error);
    return res.status(500).json({ serverMsg: "Email verification failed" });
  }
};

module.exports = { passport, verifyEmail, authenticate, sendVerificationEmail };
