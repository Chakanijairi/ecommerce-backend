const fs = require("fs");
const path = require("path");
const Product = require("../models/product.model");

const buildImageUrl = (req, filename) => {
  if (!filename) return undefined;
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/${filename}`;
};

const removeImage = (imageUrl) => {
  if (!imageUrl) return;
  const filepath = path.join(__dirname, "..", "uploads", path.basename(imageUrl));
  fs.unlink(filepath, () => {});
};

const createProduct = async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || price === undefined) {
    return res
      .status(400)
      .json({ message: "Name, description and price are required" });
  }

  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice)) {
    return res.status(400).json({ message: "Price must be a number" });
  }

  try {
    const product = await Product.create({
      name,
      description,
      price: numericPrice,
      imageUrl: buildImageUrl(req, req.file?.filename),
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    res.status(500).json({ message: "Failed to create product" });
  }
};

const getProducts = async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (typeof name !== "undefined") {
      product.name = name;
    }
    if (typeof description !== "undefined") {
      product.description = description;
    }
    if (typeof price !== "undefined") {
      const numericPrice = Number(price);
      if (Number.isNaN(numericPrice)) {
        return res.status(400).json({ message: "Price must be a number" });
      }
      product.price = numericPrice;
    }

    if (req.file?.filename) {
      removeImage(product.imageUrl);
      product.imageUrl = buildImageUrl(req, req.file.filename);
    }

    await product.save();

    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    removeImage(product.imageUrl);

    await product.deleteOne();

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
