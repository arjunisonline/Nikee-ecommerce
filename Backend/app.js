require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const expressEjsLayouts = require('express-ejs-layouts');

const app = express();
const port = process.env.PORT || 4000;

// Connect DB
require('./database/db');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');
app.use(expressEjsLayouts);

// Static files
app.use(express.static('public'));

// Middlewares
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'https://nikee-ecommerce.onrender.com', credentials: true }));

// Routes
app.use('/', require('./routes/index'));
app.use('/admin', require('./routes/admin'));
app.use('/products', require('./routes/products'));
app.use('/orders', require('./routes/orders'));
app.use('/api', require('./routes/api'));

// 404 handler
app.use((req, res, next) => next(createError(404)));

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(` Server running on port ${port}`);
});

module.exports = app;
