const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/Product.model");

// POST - Create new prodct
router.post("/products", (req, res, next) => {
  const { title, description, price, materials } = req.body;
  Product.create({ title, description, price, materials })
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("error creating project", err);
      res.status(500).json({ message: "Error while creating the product" });
    });
});

// GET - All projects
router.get("/products", (req, res, next) => {
  Product.find()
    .then((allProjects) => res.json(allProjects))
    .catch((err) => {
      console.log("error creating project", err);
      res.status(500).json({ message: "Error while getting the products" });
    });
});

// GET - One project
router.get("/products/:productId", (req, res, next) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Product.findById(productId)
    .then((product) => res.status(200).json(product))
    .catch((err) => {
      console.log("Error while retrieving the project", err);
      res.status(500).json({ message: "Error while retrieving the project" });
    });
});

// PUT - Update a specific product by ID
router.put("/products/:productId", (req, res, next) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  projectsService
    .findByIdandUpdate(productId, req.body, { new: true })
    .then((updateProduct) => res.json(updateProduct))
    .catch((err) => {
      console.log("Error while updating the product", err);
      res.status(500).json({ message: "Error while updating the product" });
    });
});

// DELETE - Delete one project
router.delete("/products/:productId", (req, res, next) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Product.findByIdandRemove(productId)
    .then(() =>
      res.json({
        message: `Project with ${projectId} is removed successfully.`,
      })
    )
    .catch((err) => {
      console.log("Error while deleting the project", err);
      res.status(500).json({ message: "Error while deleting the project" });
    });
});

module.exports = router;
