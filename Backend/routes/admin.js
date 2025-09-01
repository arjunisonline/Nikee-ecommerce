var express = require('express');
const verifyAdmin = require('../middleware/verifyAdmin')
const User = require('../database/schema/userSchema');
var router = express.Router();
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/changepass', verifyAdmin, function (req, res, next) {
  res.render('changepass', { message: '', errors: [] });
});

router.post('/changepass', verifyAdmin, async (req, res) => {
  const { inputOldPassword, InputNewPassword, InputConfirmNewPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    console.log(user);
    if (!user) {

      return res.status(404).render('changepass', { message: 'User not found', errors: [] });
    }

    const isMatch = await bcrypt.compare(inputOldPassword, user.password);
    if (!isMatch) {
      return res.render('changepass', { message: 'Incorrect old password', errors: [] });
    }

    if (InputNewPassword !== InputConfirmNewPassword) {
      return res.render('changepass', { message: 'Passwords do not match', errors: [] });
    }

    const hashedPassword = await bcrypt.hash(InputNewPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.render('changepass', { message: 'Password changed successfully!', errors: [] });

  } catch (err) {
    console.error(err);
    return res.status(500).render('changepass', { message: 'Server error', errors: [] });
  }
});





module.exports = router;
