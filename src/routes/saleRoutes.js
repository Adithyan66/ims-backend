import express from 'express';
import { body } from 'express-validator';
import {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale
} from '../controllers/saleController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

const saleValidation = [
  body('itemId').notEmpty().withMessage('Item ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('isCash').optional().isBoolean().withMessage('isCash must be a boolean')
];

router.get('/', getAllSales);
router.get('/:id', getSaleById);
router.post('/', protect, saleValidation, validate, createSale);
router.put('/:id', protect, saleValidation, validate, updateSale);
router.delete('/:id', protect, deleteSale);

export default router;

