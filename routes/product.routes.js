const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/Product.model");

// POST - Create new product
router.post("/products", async (req, res, next) => {
  try {
    const { title, description, price } = req.body;

    if (!title || !description || !price) {
      return res
        .status(400)
        .json({ message: "Title, description and price are required" });
    }
    const newProduct = await Product.create({ title, description, price });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("error creating product", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(400)
        .json({ message: "Invalid data from product creation", error });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET - All products
router.get("/products", async (req, res, next) => {
  try {
    const allProdcuts = await Product.find();
    res.json(allProdcuts);
  } catch (error) {
    console.error("Error getting products", error);
    res.status(500).json({ message: "Error while getting the products" });
  }
});

// GET - One product
router.get("/products/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Specified id is not valid" });
    }
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error retriving product:", error);
    res.status(500).json({ message: "Error while retriving the product" });
  }
});

// PUT - Update a specific product by ID
router.put("/products/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Specified id is not valid" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ message: "Product not found or could not be updated" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error while updating the product" });
  }
});

// DELETE - Delete one product
router.delete("/products/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Specified ID is not valid" });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ message: "Product not found or could not be deleted" });
    }
    res
      .status(200)
      .json({ message: `Product with ID ${productId} has been removed` });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error while deleting the product" });
  }
});

module.exports = router;
