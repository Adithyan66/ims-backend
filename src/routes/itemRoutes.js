import express from 'express';
import { body } from 'express-validator';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  searchItems,
  getItemsList
} from '../controllers/itemController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

const itemValidation = [
  body('name').trim().notEmpty().withMessage('Item name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a number and cannot be negative'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a number and cannot be negative')
];

router.get('/search', searchItems);
router.get('/list', protect, getItemsList);
router.get('/', getAllItems);
router.get('/:id', getItemById);
router.post('/', protect, itemValidation, validate, createItem);
router.put('/:id', protect, itemValidation, validate, updateItem);
router.delete('/:id', protect, deleteItem);

export default router;

