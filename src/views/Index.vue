<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <div class="top-navbar">
      <span class="logo">我的网站</span>
      <div class="main-menu">
        <router-link to="/shopping" class="menu-item">主页</router-link>
        <router-link to="/cart" class="menu-item">购物车</router-link>
        <router-link to="/orders" class="menu-item">我的订单</router-link>
      </div>
      <div class="right-menu">
        <input
          v-model="searchQuery"
          placeholder="搜索商品..."
          class="search-input"
        />
        <button @click="performSearch" class="search-button">搜索</button>
        <div class="balance-card"> 
          <p>余额：{{ userStore.balance }} 元</p>
          <button @click="recharge" class="recharge-button">充值100元</button>
        </div>
        <div class="user">
          用户名
          <button @click="handleLogout">退出</button>
        </div>
      </div>
    </div>
    <!-- 页面内容 -->
    <router-view />
    <!-- 底部版权信息 -->
    <div class="footer">
      <span>© 2024 My Website</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../store/userStore';
import { useRouter } from 'vue-router';

import axios from 'axios';

const userStore = useUserStore();
const searchQuery = ref('');
const router = useRouter();
const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true');

onMounted(() => {
  if (!isLoggedIn.value) {
    router.push('/login');
  }
});

const goToLogin = () => {
  router.push('/login');
};

const performSearch = () => {
  if (searchQuery.value.trim()) {
    alert(`搜索内容：${searchQuery.value}`);
  } else {
    alert('请输入搜索内容！');
  }
};

//充值功能
const recharge = async () => {
  try {
    // 获取当前用户 ID
    const id= userStore.userId; // 假设 userStore 中存储了用户 ID
// 检查是否已经获取到 id 
    // 向后端发送充值请求
    const response = await axios.post('http://localhost:8080/api/user/recharge', {
      id // 传递用户 ID 
    } );
    const newBalance = parseFloat(response.data.newBalance);
    // 更新余额并显示提示信息
    console.log('充值成功:', newBalance);
    userStore.updateBalance(response.data.newBalance); // 假设后端返回最新余额
    alert('充值成功！当前余额：' + response.data.newBalance + ' 元');
  } catch (error) {
    console.error('充值失败:', error);
    alert('充值失败，请稍后再试');
  }
};

//退出登录功能
const handleLogout = () => {
  // 清除 LocalStorage 中的登录状态和用户信息
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('username');
  localStorage.removeItem('userId'); // 清除 userId
  
  // 调用 Pinia Store 的 logout 方法，重置用户信息
  userStore.logout();
  
  // 提示用户已退出
  alert('已退出登录');
  
  // 跳转到登录页面
  router.push('/login');
};

</script>

<style scoped>

.user button{
  background-color: #e60012;
  color: #fff;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  border-radius: 4px;
  
}

.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-navbar {
  background-color: #409EFF;
  color: white;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo {
  font-size: 24px;
  color: white;
}

.main-menu {
  display: flex;
}

.menu-item {
  color: white;
  font-size: 16px;
  padding: 0 20px;
  text-decoration: none;
}

.menu-item:hover {
  background-color: #66b1ff;
}

.right-menu {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.search-input {
  width: 200px;
  margin-right: 10px;
  height: 32px;
  border: none;
  border-radius: 4px;
  padding: 0 10px;
}

.search-button {
  height: 32px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 20px;
  cursor: pointer;
}

.balance-card {
  display: flex;
  align-items: center; /* Vertically align items */
  gap: 15px; /* Space between elements */
  padding: 10px;
  border-radius: 8px;
}

.recharge-button {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.footer {
  position: relative;
  top: 10px;
  text-align: center;
  background-color: #f4f4f4;
  padding: 10px 0;
}
</style>