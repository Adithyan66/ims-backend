import express from 'express';
import {
  getSalesReport,
  getItemsReport,
  getCustomerLedger,
  sendSalesReportEmail
} from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/sales', getSalesReport);
router.get('/items', getItemsReport);
router.get('/customers/:id/ledger', getCustomerLedger);
router.post('/sales/email', protect, sendSalesReportEmail);

export default router;

