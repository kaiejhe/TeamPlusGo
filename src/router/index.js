import { createRouter, createWebHistory } from "vue-router";
import OpenGrokApp from "../pages/openGrokApp.vue";
import CardRecharge from "../pages/CardRecharge.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "OpenGrokApp",
      component: OpenGrokApp,
    },
    {
      path: "/card-recharge",
      name: "CardRecharge",
      component: CardRecharge,
    },
  ],
});

export default router;
