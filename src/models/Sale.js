import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Sale date is required'],
    default: Date.now
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'Item is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null
  },
  isCash: {
    type: Boolean,
    default: false
  },
  totalAmount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;

