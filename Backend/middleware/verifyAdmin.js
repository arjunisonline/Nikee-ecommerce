const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;;

function verifyAdmin(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded.isAdmin) return res.status(403).send('Access denied');
    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.redirect('/login');
  }
}

module.exports = verifyAdmin;
