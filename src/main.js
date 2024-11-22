// main.js
import { createApp } from 'vue';
import App from './App.vue';
import { pinia } from './store';  // 引入pinia 
import router from './router/index.js'; // 确保导入了router
import { createRouter, createWebHistory } from 'vue-router'; 
const app = createApp(App);
app.use(pinia);  // 使用pinia  
app.use(router); // 确保注册了 router
app.mount('#app');
