// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Ensure category is a required field
  currency: { type: String, required: true },
  price: { type: Number, required: true },
  availableQuantity: { type: Number, required: true }, // Change to 'availableQuantity' if needed
  imageUrl: { type: String, required: true }, // URL of the uploaded image
  createdAt: { type: Date, default: Date.now }, // Add createdAt field with default value
});

module.exports = mongoose.model('Product', productSchema);
