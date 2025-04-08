const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Manage inventory
router.get('/inventory', (req, res) => {
  // ...fetch inventory details...
});

router.post('/inventory/update', (req, res) => {
  // ...update inventory stock...
});

// Email notification for low inventory
const sendLowInventoryEmail = async (item, quantity) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: 'Low Inventory Alert',
    text: `The inventory for ${item} is below the threshold. Current quantity: ${quantity}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Low inventory email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

router.post('/inventory/check', async (req, res) => {
  const inventory = await Inventory.findOne();
  const threshold = 20; // Example threshold

  for (const [item, quantity] of Object.entries(inventory.toObject())) {
    if (quantity < threshold) {
      await sendLowInventoryEmail(item, quantity);
    }
  }

  res.status(200).json({ message: 'Inventory checked and notifications sent if needed' });
});

// Update order status
router.post('/order-status/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    const popularPizzas = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.base', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const inventoryTrends = await Inventory.findOne();

    res.status(200).json({
      totalSales: totalSales[0]?.total || 0,
      popularPizzas,
      inventoryTrends,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

module.exports = router;