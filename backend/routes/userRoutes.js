const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const orderController = require('../controllers/orderController');  // Import the order controller
const { authenticate } = require('../middleware/auth'); // Add auth middleware import

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'default_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'default_key_secret',
});

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('Razorpay key_id or key_secret is missing. Please check your .env file.');
}

// Get available pizza varieties
router.get('/pizzas', (req, res) => {
  // ...fetch and return pizza varieties...
});

// Create custom pizza order - add authentication
router.post('/order', authenticate, async (req, res) => {
  try {
    const { base, sauce, cheese, veggies } = req.body;

    if (!base || !sauce || !cheese) {
      console.log('Validation failed: Missing required fields.');
      return res.status(400).json({ message: 'Base, sauce, and cheese are required.' });
    }

    console.log('Order details received:', { base, sauce, cheese, veggies });

    const newOrder = {
      base,
      sauce,
      cheese,
      veggies,
      user: req.user.id, // Add the user ID from the authenticated request
      createdAt: new Date(),
    };

    // Save the order to the database
    const savedOrder = await Order.create(newOrder);

    console.log('Order saved successfully:', savedOrder);

    res.status(200).json({ message: 'Order placed successfully.', order: savedOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order.', details: error.message });
  }
});

// Track order status
router.get('/order-status/:orderId', async (req, res) => {
  const { orderId } = req.params;
  
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json({ 
      status: order.status, 
      order: order 
    });
  } catch (error) {
    console.error('Error fetching order status:', error);
    res.status(500).json({ message: 'Failed to get order status', details: error.message });
  }
});

// Public order tracking (no auth required)
router.post('/track-order', orderController.trackOrderPublic);

// Create Razorpay payment order
router.post('/create-order', orderController.createRazorpayOrder);

// Verify Razorpay payment
router.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ error: 'Payment verification failed' });
  }
});

// Store completed order after payment
router.post('/completed-order', orderController.completeOrder);

// Get order history - add authentication
router.get('/order-history/:userId', authenticate, async (req, res) => {
  const { userId } = req.params;
  
  // Check if user is requesting their own order history or is admin
  if (req.user.id !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized to access this order history' });
  }

  try {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ error: 'Failed to fetch order history.' });
  }
});

// Get all orders (admin only)
router.get('/orders', authenticate, async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized. Admin access only.' });
  }
  
  try {
    console.log('Fetching all orders...');
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    console.log(`Found ${orders.length} orders`);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

module.exports = router;