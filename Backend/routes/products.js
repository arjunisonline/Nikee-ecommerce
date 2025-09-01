var express = require('express');
const verifyAdmin = require('../middleware/verifyAdmin');
var router = express.Router();
const Product = require('../database/schema/productSchema');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


//Product listing
router.get('/', verifyAdmin, async (req, res) => {
  const searchTerm = req.query.name || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;

  const query = searchTerm
    ? {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } },
      ],
    }
    : {};

  try {
    const products = await Product.paginate(query, { page, limit });

    const renderData = {
      products: products.docs,
      pagination: {
        totalPages: products.totalPages,
        page: products.page,
        hasNextPage: products.hasNextPage,
        hasPrevPage: products.hasPrevPage,
        nextPage: products.nextPage,
        prevPage: products.prevPage
      },
      searchTerm
    };

    res.render('productlisting', renderData);

  } catch (err) {
    console.error(err);

    const renderData = {
      products: [],
      pagination: {
        totalPages: 0,
        page: 1,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null
      },
      searchTerm
    };

    res.render('productlisting', renderData);
  }
});


router.get('/:id', verifyAdmin, async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.render('productdetailed', { product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Couldn't Retrieve Product");
  }
});

router.post('/:id/toggle-enable', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const isEnable = req.body.isEnable === 'on';

  try {
    await Product.findByIdAndUpdate(id, { isEnable });

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update product status");
  }
});



router.post('/:id/update', verifyAdmin, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, category, brand, price } = req.body;

  try {
    const updateData = {
      name,
      category,
      brand,
      price
    };

    // Only update image if a new file is uploaded
    if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await Product.findByIdAndUpdate(id, updateData);
    res.redirect(`/products/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update product");
  }
});

router.post('/:id/delete', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {

    await Product.deleteOne({ _id: id });
    res.redirect('/products');

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete product");
  }
})


router.post('/addproduct', verifyAdmin, upload.single('image'), async (req, res) => {
  const { name, category, brand, price } = req.body;

  try {
    const newProduct = new Product({
      name,
      category,
      brand,
      price,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    await newProduct.save();
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to save product");
  }
});


module.exports = router;