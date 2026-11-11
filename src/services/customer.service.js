
const Customer = require("../models/customer.model");

/**
 * Create Customer
 */
const createCustomer = async (customerBody) => {
  if (await Customer.isEmailTaken?.(customerBody.email)) {
    throw new Error("Email already taken");
  }

  const existingCustomer = await Customer.findOne({
    email: customerBody.email,
  });

  if (existingCustomer) {
    throw new Error("Email already taken");
  }

  const customer = await Customer.create(customerBody);

  return customer;
};

/**
 * Get All Customers
 */
const getAllCustomers = async (filter = {}) => {
  const customers = await Customer.find(filter).sort({
    createdAt: -1,
  });

  return customers;
};

/**
 * Get Single Customer
 */
const getCustomerById = async (customerId) => {
  return Customer.findById(customerId);
};

/**
 * Update Customer
 */
const updateCustomerById = async (customerId, updateBody) => {
  const customer = await Customer.findById(customerId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  if (updateBody.email) {
    const existingCustomer = await Customer.findOne({
      email: updateBody.email.toLowerCase(),
      _id: { $ne: customerId },
    });

    if (existingCustomer) {
      throw new Error("Email already taken");
    }
  }

  Object.assign(customer, updateBody);

  await customer.save();

  return customer;
};

/**
 * Delete Customer
 */
const deleteCustomerById = async (customerId) => {
  const customer = await Customer.findById(customerId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  await customer.deleteOne();

  return customer;
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
};
