const express = require('express');
const User = require('../database/schema/userSchema');
const verifyAdmin = require('../middleware/verifyAdmin');
const router = express.Router();

router.get('/', verifyAdmin, async function (req, res) {
  const { status, page = 1, limit = 3 } = req.query;

  try {
    const users = await User.find({ isAdmin: false }).populate('orders.productId');
    let orderList = [];

    users.forEach(user => {
      user.orders.forEach(order => {
        const product = order.productId;
        orderList.push({
          userId: user._id,
          username: user.name,
          orderId: order._id,
          status: order.status,
          category: product?.category,
          productName: product?.name || 'N/A',
          quantity: order.quantity,
          price: product?.price || 0,
          orderDate: order.date || 'N/A'
        });
      });
    });

    orderList.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    // filter by status
    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      orderList = orderList.filter(order => statusArray.includes(order.status));
    }

    const totalOrders = orderList.length;
    const totalPages = Math.ceil(totalOrders / limit);
    const currentPage = parseInt(page);
    const startIndex = (currentPage - 1) * limit;
    const paginatedOrders = orderList.slice(startIndex, startIndex + parseInt(limit));

    res.render('orderpage', {
      orders: paginatedOrders,
      pagination: {
        totalPages,
        currentPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        nextPage: currentPage + 1,
        prevPage: currentPage - 1
      },
      selectedStatus: status
    });
  } catch (err) {
    console.error(err);
    res.render('orderpage', { orders: [], pagination: {}, selectedStatus: [] });
  }
});



router.post('/cancel-order/:userId/:orderId', verifyAdmin, async (req, res) => {
  const { userId, orderId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).send('User not found');

    const order = user.orders.id(orderId);
    if (!order) return res.status(404).send('Order not found');

    order.status = 'cancelled';
    await user.save();

    res.redirect('/orders');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});


module.exports = router;
