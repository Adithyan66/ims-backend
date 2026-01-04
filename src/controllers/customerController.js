import Customer from '../models/Customer.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getAllCustomers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const maxLimit = 100;
    const actualLimit = Math.min(limit, maxLimit);
    const skip = (page - 1) * actualLimit;

    const total = await Customer.countDocuments();
    const customers = await Customer.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(actualLimit);

    const totalPages = Math.ceil(total / actualLimit);

    sendSuccess(res, {
      data: customers,
      pagination: {
        total,
        page,
        limit: actualLimit,
        totalPages
      }
    }, 'Customers retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return sendError(res, 'Customer not found', 404);
    }

    sendSuccess(res, customer, 'Customer retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req, res, next) => {
  try {
    const { name, address, mobileNumber } = req.body;

    const customer = await Customer.create({
      name,
      address,
      mobileNumber
    });

    sendSuccess(res, customer, 'Customer created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const { name, address, mobileNumber } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, address, mobileNumber },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return sendError(res, 'Customer not found', 404);
    }

    sendSuccess(res, customer, 'Customer updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return sendError(res, 'Customer not found', 404);
    }

    sendSuccess(res, null, 'Customer deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const searchCustomers = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return sendError(res, 'Search query is required', 400);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const maxLimit = 100;
    const actualLimit = Math.min(limit, maxLimit);
    const skip = (page - 1) * actualLimit;

    const query = {
      name: { $regex: q, $options: 'i' }
    };

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(actualLimit);

    const totalPages = Math.ceil(total / actualLimit);

    sendSuccess(res, {
      data: customers,
      pagination: {
        total,
        page,
        limit: actualLimit,
        totalPages
      }
    }, 'Search results retrieved successfully');
  } catch (error) {
    next(error);
  }
};

