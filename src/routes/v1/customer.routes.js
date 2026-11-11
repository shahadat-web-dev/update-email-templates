
const express = require("express");
const customerController = require("../../controllers/customer.controller");

const router = express.Router();

// Create Customer
router.post("/", customerController.createCustomer);

// Get All Customers
router.get("/", customerController.getAllCustomers);

// Get Single Customer
router.get("/:customerId", customerController.getCustomer);

// Update Customer
router.patch("/:customerId", customerController.updateCustomer);

// Delete Customer
router.delete("/:customerId", customerController.deleteCustomer);

module.exports = router;
