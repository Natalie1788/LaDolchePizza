<template>
  <div v-if="profile">
    <h2>Welcome, {{ profile.username }}</h2>
    <p>Email: {{ profile.email }}</p>
    <p v-if="profile.orders && profile.orders.length">
      Orders: {{ profile.orders.join(", ") }}
    </p>
    <!-- Кнопка для выхода -->
    <button @click="logout">Logout</button>
  </div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>Loading...</div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useCartStore } from "@/stores/cartStore";
import { userProfile, fetchUserProfile, error } from "../components/Profile"; // Импорт функций

export default {
  setup() {
    const profile = userProfile;
    const cartStore = useCartStore();

    onMounted(async () => {
      await fetchUserProfile();
    });
    // Метод для выхода из системы
    const logout = () => {
      // Удаляем токен из localStorage
      localStorage.removeItem("token");
      cartStore.clearCart();
      // Перенаправляем на страницу входа
      window.location.href = "/auth";
      //this.$router.push("/");
    };

    return { profile, error, logout };
  },
};
</script>
