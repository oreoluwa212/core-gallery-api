// controllers/productController.js
const Product = require("../models/Product");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    if (products.length === 0)
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  const { name, description, price, category, currency, availableQuantity } = req.body;
  const imageUrl = req.file?.path; // Ensure the file is uploaded

  if (!imageUrl) {
    return res.status(400).json({ message: 'Image is required' });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      currency,
      availableQuantity,
      imageUrl,
      createdAt: Date.now(), // Explicitly setting createdAt (optional)
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/productController.js
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;

  // Trim and parse incoming data
  const {
    name,
    description,
    price,
    category,
    currency,
    availableQuantity
  } = req.body;

  const imageUrl = req.file ? req.file.path : undefined; // Only get the image URL if a file was uploaded

  try {
    // Find the product and update it
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        category,
        currency,
        availableQuantity,
        ...(imageUrl && { imageUrl }) // Only update imageUrl if a new image was uploaded
      },
      { new: true, runValidators: true } // Options to return the updated document and run validation
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};