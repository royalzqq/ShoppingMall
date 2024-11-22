// store/index.js
import { createPinia } from 'pinia';
import { useUserStore } from './userStore';
import { useCartStore } from './cart';
import { useOrdersStore } from './orders';
import { useHomeStore } from './home';

const pinia = createPinia();

export {
  useUserStore,
  useCartStore,
  useOrdersStore,
  useHomeStore,
  pinia
};