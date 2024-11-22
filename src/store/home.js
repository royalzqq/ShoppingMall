// store/home.js
import { defineStore } from 'pinia';

export const useHomeStore = defineStore('home', {
  state: () => ({
    balance: 0,
  }),
  actions: {
    updateBalance(amount) {
      this.balance = this.balance + amount;
    },
    deductBalance(amount) {
      this.balance -= amount;
    },
  },
  getters: {
    getBalance() {
      return this.balance;
    },
  }
});
