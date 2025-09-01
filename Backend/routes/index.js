const express = require('express');
const User = require('../database/schema/userSchema');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const verifyAdmin = require('../middleware/verifyAdmin');
const JWT_SECRET = process.env.JWT_SECRET;;
const Product = require('../database/schema/productSchema');


/* GET home page. */
router.get('/', verifyAdmin, async function (req, res, next) {
  try {
    const userCount = await User.countDocuments({isAdmin:false});
    const productCount = await Product.countDocuments();

    // Count total number of orders across all users
    const users = await User.find({}, 'orders');
    const orderCount = users.reduce((acc, user) => acc + (user.orders?.length || 0), 0);

    res.render('index', { userCount, productCount, orderCount });
  } catch (err) {
    console.error(err);
    res.render('index', { userCount: 0, productCount: 0, orderCount: 0 });
  }
});


/* GET admin landing page. */
router.get('/login', function (req, res) {
  res.render('loginpage', { errors: [], message: '' });
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('loginpage', { message: 'Incorrect Email Address.', errors: [] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('loginpage', { message: 'Incorrect Password.', errors: [] });
    }

    if (!user.isAdmin) {
      return res.render('loginpage', { message: 'User not admin.', errors: [] });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
  

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.render('loginpage', { message: 'Internal Server Error', errors: [] });
  }
});


router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});



router.get('/users', verifyAdmin, async (req, res, next) => {
  try {
    const userList = await User.find({ isAdmin: false });
    res.render('userpage', { users: userList });
  } catch (err) {
    console.error(err);
    res.status(500).send("Couldn't Retrieve users");
  }

});


module.exports = router;
