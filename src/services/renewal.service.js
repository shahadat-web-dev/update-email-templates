
const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Renewal = require("../models/renewal.model");

/**
 * Create Renewal
 */
const createRenewal = async (customerId, renewalBody) => {
  // Validate Customer ID
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error("Invalid customer ID");
  }

  // Find Customer
  const customer = await Customer.findById(customerId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  const { durationMonths } = renewalBody;

  // Validate Duration
  if (![3, 6, 12].includes(Number(durationMonths))) {
    throw new Error("Duration must be 3, 6 or 12 months");
  }

  // Previous subscription expiry becomes new start date
  const periodStart = new Date(customer.expiresAt);

  // Calculate new expiry date
  const periodEnd = new Date(periodStart);

  periodEnd.setMonth(
    periodEnd.getMonth() + Number(durationMonths)
  );

  // Create Renewal History
  const renewal = await Renewal.create({
    customerId: customer._id,
    periodStart,
    periodEnd,
    durationMonths: Number(durationMonths),
    type: "renewal",
  });

  // Update Customer
  customer.startDate = periodStart;
  customer.durationMonths = Number(durationMonths);
  customer.expiresAt = periodEnd;

  await customer.save();

  return renewal;
};

/**
 * Get All Renewals
 */
const getAllRenewals = async () => {
  return Renewal.find()
    .populate("customerId", "fullName email phone")
    .sort({ createdAt: -1 });
};

/**
 * Get Renewals By Customer
 */
const getRenewalsByCustomerId = async (customerId) => {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error("Invalid customer ID");
  }

  const customer = await Customer.findById(customerId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  return Renewal.find({ customerId })
    .sort({ createdAt: -1 });
};

module.exports = {
  createRenewal,
  getAllRenewals,
  getRenewalsByCustomerId,
};
