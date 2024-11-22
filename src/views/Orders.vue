<!-- src/views/Order.vue -->
<template>
  <div>
    <h1>我的订单</h1>
    <div v-if="orders.length > 0">
      <ul class="order-list">
        <li v-for="order in orders" :key="order.id" class="order-item">
          <div class="order-header">
            <h3>订单号: {{ order.id }}</h3>
            <p>下单时间: {{ order.date }}</p>
          </div>
          <div class="order-content">
            <div v-for="item in order.items" :key="item.id" class="product-item">
              <img :src="item.image" alt="product" class="product-image">
              <div class="product-info">
                <p>{{ item.name }}</p>
                <p>数量: {{ item.quantity }}</p>
              </div>
              <div class="product-sidebar">
                <p>金额: ￥{{ (item.price * item.quantity).toFixed(2) }}</p>
                <p :class="{ 'shipping-status': true, 'shipped': order.shipped }">
                  发货状态: {{ order.shipped ? '已发货' : '未发货' }}
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <p v-else>暂无订单</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['orders']), // 从 Vuex 中获取 orders 状态
  },
};
</script>

<style scoped>
/* 你可以保持原样的样式，已足够显示订单列表 */
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.order-list {
  list-style: none;
  padding: 0;
}

.order-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.order-content {
  display: flex;
  flex-direction: column;
}

.product-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 10px;
}

.product-image {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-sidebar {
  text-align: right;
}

.shipping-status {
  font-weight: bold;
}

.shipped {
  color: green;
}
</style>
