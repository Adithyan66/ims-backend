import Sale from '../models/Sale.js';
import Item from '../models/Item.js';
import Customer from '../models/Customer.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getAllSales = async (req, res, next) => {
  try {
    const sales = await Sale.find()
      .populate('itemId', 'name description price')
      .populate('customerId', 'name mobileNumber address')
      .sort({ createdAt: -1 });

    sendSuccess(res, sales, 'Sales retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getSaleById = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('itemId', 'name description price')
      .populate('customerId', 'name mobileNumber address');

    if (!sale) {
      return sendError(res, 'Sale not found', 404);
    }

    sendSuccess(res, sale, 'Sale retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createSale = async (req, res, next) => {
  try {
    const { itemId, quantity, customerId, isCash, date } = req.body;

    const item = await Item.findById(itemId);
    if (!item) {
      return sendError(res, 'Item not found', 404);
    }

    if (item.quantity < quantity) {
      return sendError(res, `Insufficient stock. Available: ${item.quantity}`, 400);
    }

    if (!isCash && customerId) {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return sendError(res, 'Customer not found', 404);
      }
    }

    if (isCash && customerId) {
      return sendError(res, 'Cash sale cannot have a customer', 400);
    }

    const totalAmount = quantity * item.price;

    const sale = await Sale.create({
      itemId,
      quantity,
      customerId: isCash ? null : customerId,
      isCash: isCash || false,
      totalAmount,
      date: date || new Date()
    });

    item.quantity -= quantity;
    await item.save();

    const populatedSale = await Sale.findById(sale._id)
      .populate('itemId', 'name description price')
      .populate('customerId', 'name mobileNumber address');

    sendSuccess(res, populatedSale, 'Sale created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateSale = async (req, res, next) => {
  try {
    const { itemId, quantity, customerId, isCash, date } = req.body;

    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return sendError(res, 'Sale not found', 404);
    }

    const oldItem = await Item.findById(sale.itemId);
    if (!oldItem) {
      return sendError(res, 'Original item not found', 404);
    }

    let newItem = oldItem;
    if (itemId && itemId.toString() !== sale.itemId.toString()) {
      newItem = await Item.findById(itemId);
      if (!newItem) {
        return sendError(res, 'New item not found', 404);
      }
    }

    const oldQuantity = sale.quantity;
    const newQuantity = quantity || oldQuantity;

    if (newItem.quantity + oldQuantity < newQuantity) {
      return sendError(res, `Insufficient stock. Available: ${newItem.quantity + oldQuantity}`, 400);
    }

    if (!isCash && customerId) {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return sendError(res, 'Customer not found', 404);
      }
    }

    if (isCash && customerId) {
      return sendError(res, 'Cash sale cannot have a customer', 400);
    }

    oldItem.quantity += oldQuantity;
    
    if (itemId && itemId.toString() !== sale.itemId.toString()) {
      await oldItem.save();
      newItem.quantity -= newQuantity;
      await newItem.save();
    } else {
      oldItem.quantity -= newQuantity;
      await oldItem.save();
      newItem = oldItem;
    }

    const totalAmount = newQuantity * newItem.price;

    const updatedSale = await Sale.findByIdAndUpdate(
      req.params.id,
      {
        itemId: itemId || sale.itemId,
        quantity: newQuantity,
        customerId: isCash ? null : (customerId || sale.customerId),
        isCash: isCash !== undefined ? isCash : sale.isCash,
        totalAmount,
        date: date || sale.date
      },
      { new: true, runValidators: true }
    ).populate('itemId', 'name description price')
     .populate('customerId', 'name mobileNumber address');

    sendSuccess(res, updatedSale, 'Sale updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteSale = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return sendError(res, 'Sale not found', 404);
    }

    const item = await Item.findById(sale.itemId);
    if (!item) {
      return sendError(res, 'Item not found', 404);
    }

    item.quantity += sale.quantity;
    await item.save();

    await Sale.findByIdAndDelete(req.params.id);

    sendSuccess(res, null, 'Sale deleted successfully');
  } catch (error) {
    next(error);
  }
};

