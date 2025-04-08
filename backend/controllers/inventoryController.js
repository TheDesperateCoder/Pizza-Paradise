const Inventory = require('../models/Inventory');
const { sendLowStockNotification } = require('../utils/emailService');

// Get all inventory items
exports.getAllInventory = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find().sort({ category: 1, name: 1 });
    res.status(200).json(inventoryItems);
  } catch (error) {
    console.error('Error getting inventory:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get inventory by category
exports.getInventoryByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const inventoryItems = await Inventory.find({ category }).sort({ name: 1 });
    res.status(200).json(inventoryItems);
  } catch (error) {
    console.error('Error getting inventory by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single inventory item
exports.getInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    res.status(200).json(item);
  } catch (error) {
    console.error('Error getting inventory item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new inventory item
exports.addInventoryItem = async (req, res) => {
  try {
    const { name, category, quantity, unit, threshold, price, description, imageUrl } = req.body;
    
    // Check if item with same name and category already exists
    const existingItem = await Inventory.findOne({ name, category });
    if (existingItem) {
      return res.status(400).json({ message: 'Item with this name and category already exists' });
    }
    
    const newItem = new Inventory({
      name,
      category,
      quantity,
      unit,
      threshold,
      price,
      description,
      imageUrl
    });
    
    const savedItem = await newItem.save();
    
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update inventory item
exports.updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const item = await Inventory.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    // Check if quantity is below threshold after update
    if (updates.quantity && updates.quantity < item.threshold) {
      // Send notification email to admin
      await sendLowStockNotification([{
        name: updatedItem.name,
        quantity: updatedItem.quantity,
        threshold: updatedItem.threshold
      }]);
    }
    
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete inventory item
exports.deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Inventory.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    await Inventory.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Set inventory threshold
exports.setItemThreshold = async (req, res) => {
  try {
    const { id } = req.params;
    const { threshold } = req.body;
    
    if (!threshold || threshold < 1) {
      return res.status(400).json({ message: 'Valid threshold value is required' });
    }
    
    const item = await Inventory.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    item.threshold = threshold;
    await item.save();
    
    res.status(200).json(item);
  } catch (error) {
    console.error('Error setting inventory threshold:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get low stock items
exports.getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lt: ["$quantity", "$threshold"] }
    });
    
    res.status(200).json(lowStockItems);
  } catch (error) {
    console.error('Error getting low stock items:', error);
    res.status(500).json({ message: 'Server error' });
  }
};