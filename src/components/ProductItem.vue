<!-- src/components/ProductItem.vue -->
<template>
    <div class="product-item">
      <img :src="product.image" :alt="product.name" />
      <h3>{{ product.name }}</h3>
      <p>{{ product.description }}</p>
      <p>￥{{ product.price.toFixed(2) }}</p> 
      <button @click="addToCart">添加到购物车</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      product: Object
    },
    methods: { 
      addToCart() {
        this.$emit('add-to-cart', this.product); 
      }
    }
  }
  </script>
  
  <style scoped>
  .product-item {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px;
    display: inline-block;
    width: 200px;
  }
  .product-item img {
    width: 100%;
    height: auto;
  }
  </style>
  