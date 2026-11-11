
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const customerService = require("../services/customer.service");

/**
 * Create Customer
 */
const createCustomer = catchAsync(async (req, res) => {
  const customer = await customerService.createCustomer(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Customer created successfully",
    data: customer,
  });
});

/**
 * Get All Customers
 */
const getAllCustomers = catchAsync(async (req, res) => {
  const customers = await customerService.getAllCustomers();

  res.status(httpStatus.OK).send({
    success: true,
    message: "Customers retrieved successfully",
    data: customers,
  });
});

/**
 * Get Single Customer
 */
const getCustomer = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerById(
    req.params.customerId
  );

  if (!customer) {
    return res.status(httpStatus.NOT_FOUND).send({
      success: false,
      message: "Customer not found",
    });
  }

  res.status(httpStatus.OK).send({
    success: true,
    message: "Customer retrieved successfully",
    data: customer,
  });
});

/**
 * Update Customer
 */
const updateCustomer = catchAsync(async (req, res) => {
  const customer = await customerService.updateCustomerById(
    req.params.customerId,
    req.body
  );

  res.status(httpStatus.OK).send({
    success: true,
    message: "Customer updated successfully",
    data: customer,
  });
});

/**
 * Delete Customer
 */
const deleteCustomer = catchAsync(async (req, res) => {
  await customerService.deleteCustomerById(req.params.customerId);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Customer deleted successfully",
  });
});

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
