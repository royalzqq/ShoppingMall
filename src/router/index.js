import { createRouter, createWebHistory } from 'vue-router'; 
import App from '../App.vue'; // 确保路径正确
import Index from '../views/Index.vue'; // 主页面

const routes = [
  {
    path: '/',
    redirect: '/login', // 默认重定向到 /login 页面
  },
  {
    path: '/',
    component: App, // 根路径渲染 App.vue
    children: [
      {
        path: 'index', // 设置为相对路径，'/index' 现在会渲染 Index.vue
        component: Index,
        children: [
          {
            path: '/shopping', // /shopping 会在 Index.vue 渲染
            component: () => import('@/views/Shopping.vue'),
          },
          {
            path: '/cart', // /cart 会在 Index.vue 渲染
            component: () => import('../views/Cart.vue'),
          },
          {
            path: '/orders', // /orders 会在 Index.vue 渲染
            component: () => import('../views/Orders.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
