import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import MenuPage from "../pages/MenuPage.vue";
import ContactPage from "../pages/ContactPage.vue";
import AuthPage from "../pages/AuthPage.vue";
import ProfilePage from "@/pages/ProfilePage.vue";
import CartPage from "@/pages/CartPage.vue";
import PizzaPage from "@/pages/PizzaPage.vue";

const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/menu", name: "Menu", component: MenuPage },
  {
    path: "/menu/:id",
    name: "Pizza",
    component: PizzaPage,
    props: true, // Пропсы из маршрута передаются в компонент
  },
  { path: "/contact", name: "Contact", component: ContactPage },
  { path: "/auth", name: "Sign up", component: AuthPage },
  { path: "/profile", name: "Profile", component: ProfilePage },
  {
    path: "/cart",
    name: "Cart",
    component: CartPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route Guard для проверки авторизации
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Проверка токена

  if (to.meta.requiresAuth && !isAuthenticated) {
    alert("Please sign in to see this page"); // Сообщение
    next("/auth"); // Редирект на страницу логина
  } else {
    next(); // Разрешаем переход
  }
});

export default router;

//component: () => import('../views/AboutView.vue'),
