const router = require("express").Router();
const { User, validateCreateUser } = require("../../models/User");
const auth = require("../auth");
const passport = require("../passport");

router.post("/create", async (req, res) => {
  const data = req.body.user;
  const { error } = validateCreateUser(data);
  if (error) {
    res.status(400).send(error.message);
  } else {
    try {
      const { username, email, password } = data;
      const user = new User();
      user.username = username;
      user.email = email;
      user.password = user.setPassword(password);
      await user.save();
      res.status(200).json({ user: user.toAuthJSON() });
    } catch (ex) {
      console.log("error is: ", ex.message);
      res.status(500).json({ message: "something wrong" });
    }
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body.user;
  if (!email) {
    res.status(400).json({ message: "email cannot be blank" });
  }
  if (!password) {
    res.status(400).json({ message: "password cannot be blank" });
  }
  try {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (user) {
        user.token = user.generateJWT();
        return res.json({ user: user.toAuthJSON() });
      } else {
        return res.status(422).json(info);
      }
    })(req, res, next);
  } catch (ex) {
    console.log(ex.message);
    res.status(500).json({ message: "something wrong" });
  }
});

module.exports = router;
