import Sale from '../models/Sale.js';
import Item from '../models/Item.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { sendSalesReportEmail as sendEmail } from '../utils/emailService.js';

export const getSalesReport = async (req, res, next) => {
  try {
    const sales = await Sale.find()
      .populate('itemId', 'name description price')
      .populate('customerId', 'name mobileNumber address')
      .sort({ createdAt: -1 });

    sendSuccess(res, sales, 'Sales report retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getItemsReport = async (req, res, next) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });

    sendSuccess(res, items, 'Items report retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getCustomerLedger = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sales = await Sale.find({ customerId: id })
      .populate('itemId', 'name description price')
      .populate('customerId', 'name mobileNumber address')
      .sort({ createdAt: -1 });

    sendSuccess(res, sales, 'Customer ledger retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const sendSalesReportEmail = async (req, res, next) => {
  try {
    const userEmail = req.user.email;

    const sales = await Sale.find()
      .populate('itemId', 'name description price')
      .populate('customerId', 'name mobileNumber address')
      .sort({ createdAt: -1 });

    if (sales.length === 0) {
      return sendError(res, 'No sales data to send', 400);
    }

    await sendEmail(userEmail, sales);

    sendSuccess(res, null, 'Sales report sent to email successfully');
  } catch (error) {
    next(error);
  }
};

