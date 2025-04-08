const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/create', authMiddleware, orderController.createOrder);

// Get order history for authenticated user
router.get('/history', authMiddleware, orderController.getUserOrders);

// Get a specific order by ID
router.get('/:id', authMiddleware, orderController.getOrderById);

// Update order status (admin only)
router.patch('/:id/status', authMiddleware, orderController.updateOrderStatus);

// Cancel an order
router.post('/:id/cancel', authMiddleware, orderController.cancelOrder);

module.exports = router;