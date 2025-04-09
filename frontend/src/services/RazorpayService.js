import axios from 'axios';
import API_BASE_URL from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

const RazorpayService = {
  createOrder: async (amount) => {
    try {
      const response = await axios.post(`${API_URL}/payment/create-order`, { amount });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  verifyPayment: async (paymentData) => {
    try {
      const response = await axios.post(`${API_URL}/payment/verify-payment`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  },

  initializePayment: (orderData, userData, onSuccess, onError) => {
    const options = {
      key: orderData.key_id, // Get key from backend response instead of env variable
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Pizza Paradise',
      description: 'Food Order Payment',
      order_id: orderData.id,
      handler: async (response) => {
        try {
          // Send payment verification to backend
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          };
          
          const result = await RazorpayService.verifyPayment(verificationData);
          onSuccess(result);
        } catch (error) {
          console.error('Payment verification failed:', error);
          onError(error);
        }
      },
      prefill: {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        contact: userData.phone,
      },
      notes: {
        address: userData.address
      },
      theme: {
        color: '#FF5F6D'
      }
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  }
};

export default RazorpayService;