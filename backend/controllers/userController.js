const User = require('../models/User');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, could not fetch profile'
    });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, contactNumber } = req.body;
    
    // Find user and update
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email, contactNumber },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, could not update profile'
    });
  }
};

// Get user addresses
exports.getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');
    
    res.status(200).json({
      success: true,
      addresses: user.addresses || []
    });
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, could not fetch addresses'
    });
  }
};

// Add user address
exports.addUserAddress = async (req, res) => {
  try {
    const { label, street, city, state, postalCode, isDefault } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Create new address
    const newAddress = {
      label,
      street,
      city,
      state,
      postalCode,
      isDefault: isDefault || false
    };
    
    // If this is default, unset any existing default
    if (newAddress.isDefault && user.addresses && user.addresses.length > 0) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // Add to addresses array
    user.addresses.push(newAddress);
    await user.save();
    
    res.status(201).json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Error adding user address:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, could not add address'
    });
  }
};

// Update user address
exports.updateUserAddress = async (req, res) => {
  try {
    const { label, street, city, state, postalCode, isDefault } = req.body;
    const addressId = req.params.id;
    
    const user = await User.findById(req.user.id);
    
    // Find address in the array
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // If setting as default, unset any existing default
    if (isDefault && user.addresses.some(addr => addr.isDefault)) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // Update address
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      label: label || user.addresses[addressIndex].label,
      street: street || user.addresses[addressIndex].street,
      city: city || user.addresses[addressIndex].city,
      state: state || user.addresses[addressIndex].state,
      postalCode: postalCode || user.addresses[addressIndex].postalCode,
      isDefault: isDefault !== undefined ? isDefault : user.addresses[addressIndex].isDefault
    };
    
    await user.save();
    
    res.status(200).json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Error updating user address:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, could not update address'
    });
  }
};

// Delete user address
exports.deleteUserAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    
    const user = await User.findById(req.user.id);
    
    // Filter out the address to delete
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    
    await user.save();
    
    res.status(200).json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Error deleting user address:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, could not delete address'
    });
  }
};

// Get payment methods
exports.getPaymentMethods = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('paymentMethods');
    
    res.status(200).json({
      success: true,
      paymentMethods: user.paymentMethods || []
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, could not fetch payment methods'
    });
  }
};

// Add payment method
exports.addPaymentMethod = async (req, res) => {
  try {
    const { cardType, lastFour, expiryMonth, expiryYear, isDefault } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Create new payment method
    const newPayment = {
      cardType,
      lastFour,
      expiryMonth,
      expiryYear,
      isDefault: isDefault || false
    };
    
    // If this is default, unset any existing default
    if (newPayment.isDefault && user.paymentMethods && user.paymentMethods.length > 0) {
      user.paymentMethods.forEach(payment => {
        payment.isDefault = false;
      });
    }
    
    // Add to payment methods array
    user.paymentMethods.push(newPayment);
    await user.save();
    
    res.status(201).json({
      success: true,
      paymentMethods: user.paymentMethods
    });
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, could not add payment method'
    });
  }
};

// Delete payment method
exports.deletePaymentMethod = async (req, res) => {
  try {
    const paymentId = req.params.id;
    
    const user = await User.findById(req.user.id);
    
    // Filter out the payment method to delete
    user.paymentMethods = user.paymentMethods.filter(payment => payment._id.toString() !== paymentId);
    
    await user.save();
    
    res.status(200).json({
      success: true,
      paymentMethods: user.paymentMethods
    });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, could not delete payment method'
    });
  }
};