import Item from '../models/Item.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getAllItems = async (req, res, next) => {
  try {
    const { q } = req.query;
    let query = {};

    if (q) {
      query = { $text: { $search: q } };
    }

    const items = await Item.find(query).sort({ createdAt: -1 });

    sendSuccess(res, items, 'Items retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return sendError(res, 'Item not found', 404);
    }

    sendSuccess(res, item, 'Item retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createItem = async (req, res, next) => {
  try {
    const { name, description, quantity, price } = req.body;

    const item = await Item.create({
      name,
      description,
      quantity,
      price
    });

    sendSuccess(res, item, 'Item created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const { name, description, quantity, price } = req.body;

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, description, quantity, price },
      { new: true, runValidators: true }
    );

    if (!item) {
      return sendError(res, 'Item not found', 404);
    }

    sendSuccess(res, item, 'Item updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return sendError(res, 'Item not found', 404);
    }

    sendSuccess(res, null, 'Item deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const searchItems = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return sendError(res, 'Search query is required', 400);
    }

    const items = await Item.find({ $text: { $search: q } }).sort({ createdAt: -1 });

    sendSuccess(res, items, 'Search results retrieved successfully');
  } catch (error) {
    next(error);
  }
};

