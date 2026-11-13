
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const renewalService = require("../services/renewal.service");

/**
 * Create Renewal
 */
const createRenewal = catchAsync(async (req, res) => {
  const renewal = await renewalService.createRenewal(
    req.params.customerId,
    req.body
  );

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Customer renewed successfully",
    data: renewal,
  });
});

/**
 * Get All Renewals
 */
const getAllRenewals = catchAsync(async (req, res) => {
  const renewals = await renewalService.getAllRenewals();

  res.status(httpStatus.OK).send({
    success: true,
    message: "Renewals retrieved successfully",
    data: renewals,
  });
});

/**
 * Get Renewals By Customer
 */
const getRenewalsByCustomer = catchAsync(async (req, res) => {
  const renewals = await renewalService.getRenewalsByCustomerId(
    req.params.customerId
  );

  res.status(httpStatus.OK).send({
    success: true,
    message: "Customer renewal history retrieved successfully",
    data: renewals,
  });
});

module.exports = {
  createRenewal,
  getAllRenewals,
  getRenewalsByCustomer,
};
