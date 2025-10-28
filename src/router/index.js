import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import VerificationSuccess from "../pages/VerificationSuccess.vue";

const STORAGE_KEY = "team-verified-card";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/verify-success",
      name: "VerificationSuccess",
      component: VerificationSuccess,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.name === "VerificationSuccess" && typeof window !== "undefined") {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return next({ name: "Home" });
    }
  }
  next();
});

export default router;
