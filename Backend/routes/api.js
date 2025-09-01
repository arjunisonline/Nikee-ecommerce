const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Product = require('../database/schema/productSchema');
const User = require('../database/schema/userSchema');

const router = express.Router();

//  Middleware to verify JWT token
const VerifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access Denied: No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};


// Signup
router.post('/signup', async (req, res) => {
    console.log("Incoming request body:", req.body);

    const { name, email, password, address, number } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ error: "Name is missing in request body" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            address,
            number
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});



//  Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Could not login');
    }
});

//  Change password
router.post('/changepass', VerifyToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//  Add to cart
router.post('/addtocart/:productId', VerifyToken, async (req, res) => {
    const productId = req.params.productId;
    const { quantity = 1 } = req.body;
    try {
        const user = await User.findById(req.user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const existingItem = user.cart.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cart.push({ productId, quantity: 1 });
        }

        await user.save();
        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


//  Remove from cart
router.post('/remove/:productId', VerifyToken, async (req, res) => {
    const productId = req.params.productId;

    try {
        const user = await User.findById(req.user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        await user.save();

        res.status(200).json({ message: 'Product removed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


//  Buy entire cart
router.post('/buycart', VerifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const newOrders = user.cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            date: new Date(),
            status: 'pending',
        }));

        user.orders.push(...newOrders);
        user.cart = [];
        await user.save();

        res.status(200).json({ message: 'Order placed successfully', orders: user.orders });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Buy individual product
router.post('/checkout/:productId', VerifyToken, async (req, res) => {
    const productId = req.params.productId;

    try {
        const user = await User.findById(req.user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.orders.push({ productId, date: new Date(), status: 'pending' });
        await user.save();

        res.status(200).json({ message: 'Product successfully ordered' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// GET productlist
router.get('/products', VerifyToken, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 4,
            category,
            brand,
            minPrice,
            maxPrice,
            name,
        } = req.query;

        const filter = { isEnable: true };

        if (category) filter.category = category;

        if (brand) {
            const brandArray = brand.split(",");
            filter.brand = { $in: brandArray };
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        const products = await Product.paginate(filter, {
            page: parseInt(page),
            limit: parseInt(limit)
        });

        // 🔁 Convert image buffer to base64
        const productList = products.docs.map(product => ({
            _id: product._id,
            name: product.name,
            price: product.price,
            category: product.category,
            brand: product.brand,
            image: product.image?.data
                ? {
                    contentType: product.image.contentType,
                    data: product.image.data.toString('base64')
                }
                : null
        }));

        const renderData = {
            productList,
            totalPage: products.totalPages,
            currentPage: products.page,
            hasNextPage: products.hasNextPage,
            hasPrevPage: products.hasPrevPage,
            nextPage: products.nextPage,
            prevPage: products.prevPage
        }



        res.status(200).json(renderData);

    } catch (err) {
        console.error(err);
        res.status(500).send("Couldn't Retrieve Products");
    }
});



//filters
router.get('/filters', async (req, res) => {
    try {
        const [categories, brands] = await Promise.all([
            Product.distinct("category", { isEnable: true }),
            Product.distinct("brand", { isEnable: true }),
        ]);

        res.status(200).json({
            categories,
            brands
        });
    } catch (err) {
        console.error("Error fetching filter options:", err);
        res.status(500).json({ message: "Failed to fetch filter options" });
    }
});



//  Get product details
router.get('/product/:productId', VerifyToken, async (req, res) => {
    const productId = req.params.productId;

    try {
        const productDetail = await Product.findById(productId);
        const product = {
            _id: productDetail._id,
            name: productDetail.name,
            price: productDetail.price,
             description: productDetail.description,
            category: productDetail.category,
            brand: productDetail.brand,
            image: productDetail.image?.data
                ? {
                    contentType: productDetail.image.contentType,
                    data: productDetail.image.data.toString('base64'),
                }
                : null,
        };
        if (!product) return res.status(404).send('Product not found');

        res.status(200).json({ product });
    } catch (err) {
        console.error(err);
        res.status(500).send("Couldn't Retrieve Product");
    }
});

// View order history
router.get('/orders', VerifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user).populate('orders.productId').sort({ date: -1 });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const orderWithDetails = user.orders.map(item => {
            const product = item.productId;
            if (!product) return null;

            return {
                name: product.name,
                price: product.price,
                image: product.image?.data
                    ? {
                        contentType: product.image.contentType,
                        data: product.image.data.toString('base64'),
                    } : null,
                productId: product._id,
                status: item.status,
                orderDate: item.date,
                quantity: item.quantity
            };
        }).filter(Boolean).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        res.status(200).json({ orders: orderWithDetails });

    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to retrieve orders');
    }
});

//  View cart
router.get('/cart', VerifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user).populate('cart.productId');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cartWithDetails = user.cart.map(item => {
            const product = item.productId;

            // Ensure product is populated
            if (!product) return null;

            return {
                name: product.name,
                price: product.price,
                image: product.image?.data
                    ? {
                        contentType: product.image.contentType,
                        data: product.image.data.toString('base64'),
                    } : null,
                productId: product._id,
                quantity: item.quantity,

            };
        }).filter(Boolean);

        res.status(200).json({ cart: cartWithDetails });

    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to retrieve cart');
    }
});

router.get('/user', VerifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

router.get('/products/featured', async (req, res) => {
    try {
        const products = await Product.find().limit(3);

        const productList = products.map(product => ({
            _id: product._id,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image?.data
                ? {
                    contentType: product.image.contentType,
                    data: product.image.data.toString('base64')
                }
                : null
        }));

        res.json(productList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not fetch featured products' });
    }
});


module.exports = router;
