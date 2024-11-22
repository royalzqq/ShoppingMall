<!-- src/components/CartItem.vue -->
<template>
    <div class="cart-item">
      <img :src="item.image" :alt="item.name" />
      <p>{{ item.name }} x {{ item.quantity }}</p>
      <p>￥{{ item.price.toFixed(2) }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      item: Object
    }
  }
  </script>
  
  <style scoped>
  .cart-item {
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
  }
  .cart-item img {
    width: 50px;
    height: auto;
  }
  </style>
  