import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [], // 购物车商品列表
    balance: 500, // 示例余额
  }),
  actions: {
    addToCart(product) {
      const existingItem = this.cartItems.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++; // 商品已存在，增加数量
      } else {
        this.cartItems.push({ ...product, quantity: 1, selected: false });
      }
    },
    removeFromCart(product) {
      const index = this.cartItems.findIndex(item => item.id === product.id);
      if (index !== -1) {
        this.cartItems.splice(index, 1);
      }
    },
    updateQuantity(productId, quantity) {
      const item = this.cartItems.find(item => item.id === productId);
      if (item && quantity >= 1) {
        item.quantity = quantity;
      }
    },
    toggleSelectAll(isSelected) {
      this.cartItems.forEach(item => item.selected = isSelected);
    },
    removeSelectedItems() {
      this.cartItems = this.cartItems.filter(item => !item.selected);
    },
    pay(amount) {
      if (this.balance >= amount) {
        this.balance -= amount; // 扣除余额
        this.clearCart(); // 结算后清空购物车
      }
    },
    clearCart() {
      this.cartItems = []; // 清空购物车
    },
  },
  getters: {
    selectAll() {
      return this.cartItems.every(item => item.selected);
    },
    totalPrice() {
      return this.cartItems
        .filter(item => item.selected)
        .reduce((total, item) => total + item.price * item.quantity, 0);
    },
  },
});
