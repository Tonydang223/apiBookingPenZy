const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailActive");
const {
  registerSchema,
  loginSchema,
} = require("../../helpers/validation/validation.userSchema");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const clientId = new OAuth2(process.env.CLIENT_ID);

const authController = {
  signUp: async function (req, res, next) {
    try {
      const { name, email, address, password, phoneNumber } = req.body;
      const { error } = registerSchema(req.body);
      if (error)
        return res.status(400).json({ ...error?.details[0], status: 400 });

      const chẹckExist = await User.findOne({ email });
      if (chẹckExist) {
        return res
          .status(409)
          .json({ error: { message: "Email is existed!!!" }, status: 409 });
      }
      const user = new User({
        name,
        email,
        address:address?address:"",
        phoneNumber:phoneNumber?phoneNumber:"",
        password,
        isVerified: false,
        role: 0,
      });
      const userSaved = await user.save();
      const emailActiveToken = createActiveMailToken({ id: userSaved._id });
      const url = `${process.env.URL_CLIENT}/auth/verify-email/${emailActiveToken}`;
      console.log(req.headers.host);
      sendEmail.emailActive(email, url, "Verify your email here");
      res.json({
        user: userSaved,
        status: 200,
        success: {
          message:
            "Register successfully and You need check your email to verify for the new account!!!",
        },
      });
    } catch (error) {
      next(error);
    }
  },
  verifyEmail: async function (req, res, next) {
    try {
      const { token } = req.body;
      jwt.verify(
        token,
        process.env.ACTIVE_EMAIL_TOKEN,
        async function (err, data) {
          if (err)
            return res
              .status(401)
              .json({ message: "token expired or token is not right" });
          console.log(data.id);
          const checkisVerified = await User.findOne({ _id: data.id });

          if (checkisVerified._doc.isVerified) {
            res
              .status(200)
              .json({
                message:
                  "Your account verified successfully before!! Please login",
              });
          }
          await User.findByIdAndUpdate(
            { _id: data.id },
            { $set: { isVerified: true } },
            { new: true }
          );
          res
            .status(200)
            .json({ message: "Your account verified successfully!!" });
        }
      );
    } catch (error) {
      res.status(500).send({ message: error });
    }
  },
  resetLink: async function (req, res, next) {
    const { email } = req.body;

    const checkMail = await User.findOne({ email });
    if (!checkMail) {
      return res.status(200).json("Your email account not existed!!!");
    }
    if (checkMail._doc.isVerified) {
      res
        .status(200)
        .json({ message: "Your account have been verified. Please log in!!!" });
    } else {
      const token = createActiveMailToken({ id: checkMail._doc._id });
      const url = `${process.env.URL_CLIENT}/auth/verify-email/${token}`;
      sendEmail.emailActive(email, url, "Verify your email here");
      res.status(200).json({ message: "Re send link successfully!!!" });
    }
  },
  logout: async function (req, res, next) {
    try {
      await res.clearCookie("refreshToken", { path: "/auth/refreshToken" });
      return res.status(200).json({ message: "Log out successfully!!!" });
    } catch (error) {
      return res.status(500).send({ message: "Log out fail!!!" });
    }
  },
  login: async function (req, res, next) {
    try {
      const userLogin = req.body;
      const { error } = loginSchema(userLogin);
      if (error)
        return res.status(200).json({ ...error?.details[0], status: 400 });

      const user = await User.findOne({ email: userLogin.email });
      if (!user) {
        return res
          .status(200)
          .json({ error: { message: "Email is not existed!!!" }, status: 200 });
      }
      const { password, ...userObj } = user._doc;
      const isValidatePassword = await bcrypt.compare(
        userLogin.password,
        user.password
      );
      if (!isValidatePassword) {
        return res
          .status(200)
          .json({ error: { message: "Invalid Password!!!" }, status: 200 });
      }
      const accessToken = createAccessToken({ id: user._doc._id });
      const refreshToken = createRefreshToken({ id: user._doc._id });
      // set cookies
      await res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/auth/refreshToken",
        maxAge: 90 * 24 * 60 * 60 * 1000, // 3 months
      });
      res.status(200).json({
        message: "Sign In successfully!!!",
        data: userObj,
        accessToken,
        refreshToken,
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  },
  generatorAccessToken: async function (req, res, next) {
    const token = req.cookies.refreshToken;
    console.log(token);
    if (!token)
      return res.status(401).json({ message: "Please log in to access" });
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      async function (error, data) {
        if (error) return res.status(403).json({ message: error });
        const user = await User.findOne({ _id: data.id }).select("-password");
        console.log(user);
        const accessToken = createAccessToken({ id: data.id });
        res.status(200).json({
          message: "Sign In successfully!!!",
          accessToken,
          user,
          status: 200,
        });
        next();
      }
    );
  },
  forgotPass: async function (req, res, next) {
    const { email } = req.body;
    console.log(email);
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Yourr email is not existed!!!" });
    const accessToken = createAccessToken({ id: user._doc._id });
    const url = `${process.env.URL_CLIENT}/auth/resetPass/${accessToken}`;
    sendEmail.emailActive(email, url, "Reset Your Password");
    return res.status(200).json({ message: "ok" });
  },
  resetPassword: async function (req, res, next) {
    try {
      const { password } = req.body;

      console.log(password.length);

      if (!password || password.length < 6 || password.length > 15)
        return res
          .status(400)
          .json({
            message:
              "Please fill in a new password or password less than 15 characters and more than 6 characters!",
          });
      const salt = await bcrypt.genSalt(10);
      const hashPasswordReset = await bcrypt.hash(password, salt);
      console.log(req.user);
      await User.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: { password: hashPasswordReset } },
        { new: true }
      );
      res
        .status(200)
        .json({ message: "You updated your password successfully!" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  loginWithGoogle: async function (req, res, next) {
    try {
      const { tokenId } = req.body;
      //    console.log(tokenId)
      if (!tokenId)
        return res.status(401).json({ message: "Unauthorization!!!" });
      const verify = await clientId.verifyIdToken({
        idToken: tokenId,
        audience: process.env.CLIENT_ID,
      });
      const { email, email_verified, name, picture } = verify.payload;
      const password = email + process.env.GOOGLE_SECRET;

      const hashPass = await bcrypt.hash(password, 12);
      console.log(email_verified)
      if (!email_verified)
        return res.status(400).json({ message: "Email is not verified!!!" });

      const user = await User.findOne({ email });
      
      if (user) {
        const accessToken = createAccessToken({ id: user._doc._id });
        const refreshToken = createRefreshToken({ id: user._doc._id });
        // set cookies
        await res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          path: "/auth/refreshToken",
          maxAge: 90 * 24 * 60 * 60 * 1000, // 3 months
        });
        res.status(200).json({data:user._doc,refreshToken,accessToken,message:"Login successfully"})
      } else {
          const newUsers = new User({
              name,
              email,
              password:hashPass,
              phoneNumber:"",
              address:"",
              avatar:picture,
              isVerified:email_verified,
              role:0
          })
          const saveUser = await newUsers.save()
          const accessToken = createAccessToken({ id: saveUser._id });
          const refreshToken = createRefreshToken({ id: saveUser._id });
          // set cookies
          await res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            path: "/auth/refreshToken",
            maxAge: 90 * 24 * 60 * 60 * 1000, // 3 months
          });
          res.status(200).json({user:saveUser,accessToken,refreshToken,message:"Login successfully!!!"})
      }
      console.log(verify);
    } catch (error) {
        console.log(error)
      res.status(500).json({message:error.message});
    }
  },
};
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "90d",
  });
};
const createActiveMailToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVE_EMAIL_TOKEN, {
    expiresIn: "1h",
  });
};

module.exports = authController;
