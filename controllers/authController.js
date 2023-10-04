const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (req, res) => {
    const newUser = new User({
      username: req.body.username,
      age: req.body.age,
      email: req.body.email,
      mobilenumber: req.body.mobilenumber,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET
      ).toString(),
    });

    try {
      await newUser.save();
      res.status(201).json("User Successfully Created");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(401).json("Your username is incorrect");
      }

      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET
      );
      const decryptedpass = hashedPassword.toString(CryptoJS.enc.Utf8);

      if (decryptedpass !== req.body.password) {
        return res.status(401).json("Wrong Password!");
      }

      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isClinician,
        },
        process.env.JWT_SEC,
        { expiresIn: "7d" }
      );

      const { password, ...others } = user._doc;
      res.status(200).json({ ...others, accessToken });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
