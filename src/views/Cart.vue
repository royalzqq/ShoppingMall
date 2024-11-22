<template>
  <div class="cart-container">
    <h2>我的购物车</h2>

    <!-- 购物车头部 -->
    <div class="cart-header">
      <span class="header-item">商品</span>
      <span class="header-item">单价(元)</span>
      <span class="header-item">优惠(元)</span>
      <span class="header-item">数量</span>
      <span class="header-item">小计(元)</span>
      <span class="header-item">操作</span>
    </div>

    <!-- 购物车商品项 -->
    <div class="cart-items">
      <div class="cart-item" v-for="item in cartItems" :key="item.id">
        <div>
          <input type="checkbox" v-model="item.selected" />
          <img :src="item.image" alt="商品图片" />
          <div class="item-info">
            <h3>{{ item.name }}</h3>
          </div>
        </div>
        <div class="item-price">￥{{ item.price.toFixed(2) }}</div>
        <div class="item-discount">-￥{{ (item.originalPrice - item.price).toFixed(2) }}</div>
        <div class="item-quantity">
          <button @click="updateQuantity(item, -1)">-</button>
          <input type="number" v-model="item.quantity" min="1" />
          <button @click="updateQuantity(item, 1)">+</button>
        </div>
        <div class="item-total">￥{{ (item.price * item.quantity).toFixed(2) }}</div>
        <div class="item-action">
          <button @click="removeItem(item)">删除</button>
        </div>
      </div>
    </div>

    <!-- 购物车底部 -->
    <div class="cart-footer">
      <div class="footer-left">
        <input type="checkbox" v-model="selectAll" />
        <span>全选</span>
        <button @click="removeSelectedItems">清除选中</button>
      </div>
      <div class="footer-right">
        <p>已选商品金额(不含运费)：<span class="total-price">￥{{ totalPrice.toFixed(2) }}</span></p>
        <button class="checkout-btn" @click="submitOrder">结算</button>
      </div>
    </div>

    <!-- 提示框 -->
    <div v-if="orderSuccessMessage.show" class="order-success">
      <p>{{ orderSuccessMessage.text }}</p>
      <button @click="closeSuccessMessage">关闭</button>
    </div>
    <div v-if="balanceInsufficientMessage.show" class="order-success" style="background-color: #f44336;">
      <p>{{ balanceInsufficientMessage.text }}</p>
      <button @click="closeInsufficientMessage">关闭</button>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '../store/cart'; // 引入 Pinia store

export default {
  data() {
    return {
      orderSuccessMessage: { show: false, text: '' },
      balanceInsufficientMessage: { show: false, text: '余额不足，请充值！' },
    };
  },
  computed: {
    cartStore() {
      return useCartStore(); // 确保在 computed 中返回 store 实例
    },
    // 获取购物车商品列表
    cartItems() {
      return this.cartStore.cartItems;
    },
    // 全选状态
    selectAll: {
      get() {
        return this.cartStore.selectAll;
      },
      set(value) {
        this.cartStore.toggleSelectAll(value);
      },
    },
    // 计算选中商品总价
    totalPrice() {
      return this.cartStore.totalPrice;
    },
  },
  methods: {
    submitOrder() {
      const selectedItems = this.cartItems.filter(item => item.selected);
      if (!selectedItems.length) {
        alert("请选择商品后再结算");
        return;
      }

      const totalAmount = this.totalPrice;
      if (this.cartStore.balance < totalAmount) {
        this.balanceInsufficientMessage.show = true;
        return;
      }

      this.cartStore.pay(totalAmount); // 执行支付
      this.orderSuccessMessage.text = `订单提交成功！总金额：￥${totalAmount.toFixed(2)}`;
      this.orderSuccessMessage.show = true;
      setTimeout(() => (this.orderSuccessMessage.show = false), 3000);
    },
    closeSuccessMessage() {
      this.orderSuccessMessage.show = false;
    },
    closeInsufficientMessage() {
      this.balanceInsufficientMessage.show = false;
    },
    removeItem(item) {
      this.cartStore.removeFromCart(item); // 删除商品
    },
    removeSelectedItems() {
      this.cartStore.removeSelectedItems(); // 批量删除选中商品
    },
    updateQuantity(item, delta) {
      this.cartStore.updateQuantity(item.id, item.quantity + delta); // 增加或减少商品数量
    },
  },
};
</script>


<style scoped>
  .cart-container {
    font-family: Arial, sans-serif;
    width: 80%;
    margin: 20px auto;
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .cart-header,
  .cart-item {
    display: grid;
    grid-template-columns: 4fr 2fr 2fr 2fr 2fr 2fr;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
  }
  
  .cart-header {
    font-weight: bold;
    color: #555;
    border-bottom: 2px solid #ddd;
  }
  
  .cart-item img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border: 1px solid #ddd;
  }
  
  .item-info {
    padding-left: 10px;
  }
  
  .item-price,
  .item-discount,
  .item-total {
    text-align: center;
    color: #333;
  }
  
  .item-quantity {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .item-quantity button {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    background-color: #fff;
    cursor: pointer;
    color:#333;
  }
  
  .item-quantity input {
    width: 50px;
    text-align: center;
    border: 1px solid #ddd;
    margin: 0 5px;
  }
  
  .cart-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
  
  .footer-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .footer-right {
    text-align: right;
  }
  
  .total-price {
    font-size: 18px;
    font-weight: bold;
    color: #e60012;
  }
  
  .checkout-btn {
    background-color: #e60012;
    color: #fff;
    padding: 10px 20px;
    border:none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .checkout-btn:hover {
    background-color: #c4000f;
  }

  .cart-item .item-action {
  text-align: center;
}

.cart-item .item-action button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
}

.cart-item .item-action button:hover {
  background-color: #c82333;
}
   
.order-success {
  position: fixed;
  top: 50%; /* 距离顶部 50% */
  left: 50%; /* 距离左侧 50% */
  transform: translate(-50%, -50%); /* 使元素真正居中 */
  background-color: #7ec050;
  color: white;
  padding: 15px;
  border-radius: 5px;
  z-index: 9999; /* 确保提示框在最上层 */
}

.order-success button {
  margin-top: 10px;
  background-color: #d32d26;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.order-success button:hover {
  background-color: #c82333;
}

.balance-insufficient-message {
  position: fixed;
  top: 50%; /* 距离顶部 50% */
  left: 50%; /* 距离左侧 50% */
  transform: translate(-50%, -50%); /* 使元素真正居中 */
  background-color: #f44336;
  color: white;
  padding: 15px;
  border-radius: 5px;
  z-index: 9999; /* 确保提示框在最上层 */
}

.balance-insufficient-message button {
  margin-top: 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.balance-insufficient-message button:hover {
  background-color: #c82333;
}

</style>
