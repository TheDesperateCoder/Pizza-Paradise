const Order = require('../models/Order');
const User = require('../models/User');
const emailSender = require('../utils/emailSender');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, paymentMethod, customerDetails, notes } = req.body;
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order must contain at least one item' 
      });
    }
    
    if (!deliveryAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Delivery address is required' 
      });
    }

    // Get user ID from authenticated request
    const userId = req.user.id;
    
    // Create new order
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      customerDetails,
      notes,
      status: 'processing'
    });
    
    const savedOrder = await newOrder.save();
    
    // Get user email for notifications
    const user = await User.findById(userId);
    
    // Send order confirmation email if email is available
    if (user && user.email) {
      try {
        // Create simple order confirmation email
        const emailContent = `
          <h2>Your Order Confirmation</h2>
          <p>Thank you for your order!</p>
          <p><strong>Order ID:</strong> ${savedOrder._id}</p>
          <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
          <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod === 'credit' ? 'Online Payment' : 'Cash on Delivery'}</p>
          <p>You can track your order status in your account dashboard.</p>
        `;
        
        await emailSender.sendEmail(
          user.email,
          'Your Pizza Order Confirmation',
          emailContent
        );
        
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        // Don't fail the order just because email failed
      }
    }
    
    return res.status(201).json({
      success: true, 
      message: 'Order placed successfully',
      order: savedOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });
    
    return res.status(200).json({ 
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching order history:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch order history'
    });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    
    // Ensure user can only access their own orders (unless admin)
    if (order.userId.toString() !== userId && req.user.accountType !== 'Admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }
    
    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch order details'
    });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status is required' 
      });
    }
    
    const validStatuses = ['processing', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status value' 
      });
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to update order status'
    });
  }
};

// Cancel order (user can cancel their own orders)
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    
    // Find the order
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    
    // Check if user owns this order
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }
    
    // Check if order can be cancelled (only processing or confirmed orders)
    if (!['processing', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order cannot be cancelled at this stage' 
      });
    }
    
    // Update order status to cancelled
    order.status = 'cancelled';
    await order.save();
    
    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to cancel order'
    });
  }
};