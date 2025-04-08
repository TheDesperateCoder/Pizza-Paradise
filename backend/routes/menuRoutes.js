const express = require('express');
const router = express.Router();
//const MenuItem = require('../models/MenuItem');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ category: 1 });
    res.status(200).json({ success: true, items: menuItems });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch menu items' });
  }
});

// Get menu items by category
router.get('/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const menuItems = await MenuItem.find({ category: categoryName });
    res.status(200).json({ success: true, items: menuItems });
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch menu items' });
  }
});

// Get a specific menu item
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    
    res.status(200).json({ success: true, item: menuItem });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch menu item' });
  }
});

// Create a new menu item (admin only)
router.post('/', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { name, description, price, category, image, ingredients, isVegetarian, isSpicy, isAvailable } = req.body;
    
    const newMenuItem = new MenuItem({
      name,
      description,
      price,
      category,
      image,
      ingredients,
      isVegetarian,
      isSpicy,
      isAvailable: isAvailable !== undefined ? isAvailable : true
    });
    
    const savedMenuItem = await newMenuItem.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Menu item created successfully',
      item: savedMenuItem
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ success: false, message: 'Failed to create menu item' });
  }
});

// Update a menu item (admin only)
router.put('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedMenuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      item: updatedMenuItem
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ success: false, message: 'Failed to update menu item' });
  }
});

// Delete a menu item (admin only)
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!deletedMenuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ success: false, message: 'Failed to delete menu item' });
  }
});

module.exports = router;