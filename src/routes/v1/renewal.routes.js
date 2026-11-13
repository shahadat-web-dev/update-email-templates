
const express = require("express");
const renewalController = require("../../controllers/renewal.controller");

const router = express.Router();

// Create Renewal
router.post("/:customerId", renewalController.createRenewal);

// Get All Renewals
router.get("/", renewalController.getAllRenewals);

// Get Customer Renewal History
router.get(
  "/customer/:customerId",
  renewalController.getRenewalsByCustomer
);

module.exports = router;
