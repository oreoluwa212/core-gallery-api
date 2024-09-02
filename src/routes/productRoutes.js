const express = require('express');
const { getAllProducts, getProductById, getProductsByCategory, createProduct } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/fileUpload');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
  
  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      imageUrl,
      stock,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
