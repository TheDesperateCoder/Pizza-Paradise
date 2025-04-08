const MenuItem = require('../models/MenuItem');

// Get all menu items
exports.getAllItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({});
    res.status(200).json({
      success: true,
      items: menuItems
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items'
    });
  }
};

// Get menu item by id
exports.getItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      item: menuItem
    });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu item'
    });
  }
};

// Get items by category
exports.getItemsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const menuItems = await MenuItem.find({ category });
    
    res.status(200).json({
      success: true,
      items: menuItems
    });
  } catch (error) {
    console.error('Error fetching items by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch items by category'
    });
  }
};

// Create new menu item (admin only)
exports.createItem = async (req, res) => {
  try {
    // Check if admin
    if (req.user.accountType !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create menu items'
      });
    }
    
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    
    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      item: menuItem
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create menu item',
      error: error.message
    });
  }
};

// Update menu item (admin only)
exports.updateItem = async (req, res) => {
  try {
    // Check if admin
    if (req.user.accountType !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update menu items'
      });
    }
    
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      item: menuItem
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update menu item',
      error: error.message
    });
  }
};

// Delete menu item (admin only)
exports.deleteItem = async (req, res) => {
  try {
    // Check if admin
    if (req.user.accountType !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete menu items'
      });
    }
    
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete menu item'
    });
  }
};