import express from 'express';
import { body } from 'express-validator';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
  getCustomersList
} from '../controllers/customerController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

const customerValidation = [
  body('name').trim().notEmpty().withMessage('Customer name is required'),
  body('mobileNumber').matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit mobile number')
];

router.get('/search', searchCustomers);
router.get('/list', protect, getCustomersList);
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/', protect, customerValidation, validate, createCustomer);
router.put('/:id', protect, customerValidation, validate, updateCustomer);
router.delete('/:id', protect, deleteCustomer);

export default router;

