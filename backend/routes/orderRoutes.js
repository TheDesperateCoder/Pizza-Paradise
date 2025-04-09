const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById } = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Protected routes - require authentication
router.post('/create', isAuthenticated, createOrder);
router.get('/', isAuthenticated, getOrders);
router.get('/:id', isAuthenticated, getOrderById);

module.exports = router;