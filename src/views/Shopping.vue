<template>
  <Suspense>
    <div class="home">
      <div class="products">
        <ProductItem
          v-for="(product, index) in products"
          :key="index"
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>
    </div>
  </Suspense>
</template>

<script>
import { ref, onMounted } from 'vue'; // 导入 Vue 3 的 Composition API
import ProductItem from '../components/ProductItem.vue';
import axios from 'axios';
import { useCartStore } from '@/store/cart';

export default {
  components: {
    ProductItem,
  },
  setup() {
    const products = ref([]); // 用于存储商品数据
    const cartStore = useCartStore(); // 使用 Pinia 获取购物车状态
    const loading = ref(true); // 定义loading为响应式变量

    // 获取所有商品数据的函数
    const fetchProducts = async () => { 
      loading.value = true; // 请求开始时设置 loading 为 true
      try {
        const response = await axios.get('http://localhost:8080/products/getAllProducts');
        if (response.status === 200) {
          products.value = response.data;
        }
      } catch (error) {
        console.error('加载商品失败:', error);
      } finally {
        loading.value = false; // 请求结束时设置 loading 为 false
      }
    };

    // 在组件挂载时获取商品数据
    onMounted(() => {
      fetchProducts();
    });

    // 添加商品到购物车
    const addToCart = async (product) => {

  const user_id = localStorage.getItem('user_id'); // 从 localStorage 获取用户 ID
      try {
        const cartItem = {
          userId: user_id,  
          productId: product.id,
          quantity: 1, // 默认数量为 1
        };
        const response = await axios.post('http://localhost:8080/orders/addToCart', cartItem);
        
        if (response.status === 200) {
          cartStore.addToCart(product);
          alert(response.data); // 显示成功消息
        } else {
          alert('添加到购物车失败');
        }
      } catch (error) {
        console.error('添加到购物车失败:', error);
        alert('添加到购物车失败: ' + (error.response ? error.response.data : error.message));
      }
    };

    return {
      products,
      addToCart,
      loading,
    };
  },
};
</script>
