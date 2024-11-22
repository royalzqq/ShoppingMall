<!-- App.vue -->
<template>
  <div>
    <router-view></router-view> 
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 

// 创建登录状态引用
const isLoggedIn = ref(false);
const router = useRouter();

// 在组件挂载时检查登录状态
onMounted(() => {
  // 从 localStorage 获取登录状态
  if (localStorage.getItem('isLoggedIn')) {
    isLoggedIn.value = true;
  } else {
    isLoggedIn.value = false;
    router.push('/login'); // 跳转到登录页
  }
});
</script>

<style>
/* 样式保持不变 */
</style>
