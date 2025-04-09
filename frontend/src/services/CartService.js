import AuthService from './AuthService';

class CartService {
  constructor() {
    this.cart = this.getCart();
  }

  // Helper to get cart from localStorage
  getCart() {
    const cartJson = localStorage.getItem('cart');
    return cartJson ? JSON.parse(cartJson) : { items: [], totalItems: 0, totalPrice: 0 };
  }

  // Save cart to localStorage
  saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cart = cart;
    return cart;
  }

  // Add item to cart
  addToCart(item) {
    const cart = this.getCart();
    const existingItemIndex = cart.items.findIndex(
      (i) => i.id === item.id && 
             JSON.stringify(i.selectedSize) === JSON.stringify(item.selectedSize) &&
             JSON.stringify(i.selectedToppings) === JSON.stringify(item.selectedToppings)
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += item.quantity;
    } else {
      cart.items.push({
        ...item,
        cartItemId: Date.now().toString() // unique ID for cart item
      });
    }

    cart.totalItems = this._calculateTotalItems(cart.items);
    cart.totalPrice = this._calculateTotalPrice(cart.items);
    
    return this.saveCart(cart);
  }

  // Update quantity of cart item
  updateCartItemQuantity(cartItemId, quantity) {
    const cart = this.getCart();
    const itemIndex = cart.items.findIndex(item => item.cartItemId === cartItemId);
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      
      // Remove item if quantity is 0
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }
      
      cart.totalItems = this._calculateTotalItems(cart.items);
      cart.totalPrice = this._calculateTotalPrice(cart.items);
      
      return this.saveCart(cart);
    }
    
    return cart;
  }

  // Remove item from cart
  removeFromCart(cartItemId) {
    const cart = this.getCart();
    cart.items = cart.items.filter(item => item.cartItemId !== cartItemId);
    
    cart.totalItems = this._calculateTotalItems(cart.items);
    cart.totalPrice = this._calculateTotalPrice(cart.items);
    
    return this.saveCart(cart);
  }

  // Clear the cart
  clearCart() {
    return this.saveCart({ items: [], totalItems: 0, totalPrice: 0 });
  }

  // Calculate total number of items
  _calculateTotalItems(items) {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  // Calculate total price
  _calculateTotalPrice(items) {
    return items.reduce((total, item) => {
      const itemPrice = this._calculateItemPrice(item);
      return total + (itemPrice * item.quantity);
    }, 0).toFixed(2);
  }

  // Calculate price for a single item with options
  _calculateItemPrice(item) {
    let price = item.price;
    
    // Add size price if applicable
    if (item.selectedSize && item.selectedSize.price) {
      price = item.selectedSize.price;
    }
    
    // Add toppings prices if applicable
    if (item.selectedToppings && item.selectedToppings.length) {
      const toppingsPrice = item.selectedToppings.reduce(
        (total, topping) => total + (topping.price || 0), 0
      );
      price += toppingsPrice;
    }
    
    return price;
  }

  // Sync cart with user account (can be implemented when backend API is ready)
  syncCartWithAccount() {
    const user = AuthService.getCurrentUser();
    if (!user) return;
    
    // This would typically call an API endpoint to sync the cart
    // For now, just return the local cart
    return this.getCart();
  }
}

export default new CartService();