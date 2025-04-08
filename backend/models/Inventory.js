const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['base', 'sauce', 'cheese', 'veggie', 'meat'],
    index: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  threshold: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to check if item is below threshold
InventorySchema.methods.isBelowThreshold = function() {
  return this.quantity < this.threshold;
};

// Static method to find all items below threshold
InventorySchema.statics.findLowStock = function() {
  return this.find({ quantity: { $lt: mongoose.expr({ $field: "threshold" }) } });
};

const Inventory = mongoose.model('Inventory', InventorySchema);

module.exports = Inventory;