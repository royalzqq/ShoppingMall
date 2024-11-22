// src/store/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null, // 用户 ID
    username: '',
    token: '',
    balance: 0, // 用户余额
    isLoggedIn: false,
  }),
  actions: {
    updateBalance(newBalance) {
    this.balance = newBalance;
  },
    setUser(user) { 
      this.userId = user.userId;
      this.username = user.username;
      this.token = user.token;
      this.isLoggedIn = true;
    },
    logout() { 
      this.userId = null;
      this.username = '';
      this.balance = 0;
      this.token = '';
      this.isLoggedIn = false;
    },
    loadUserFromLocalStorage() {
      const storedToken = localStorage.getItem('sessionToken');
      const storedUsername = localStorage.getItem('username');
      if (storedToken && storedUsername) {
        this.setUser({ username: storedUsername, token: storedToken });
      }
    }
  }
});
