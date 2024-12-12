<template>
  <div class="header">
    <div class="logo">
      <img src="../assets/LaDolcePizza-logo.svg" alt="Logo" />
    </div>

    <nav class="nav">
      <img class="phone-img" src="../assets/phone-icon.svg" alt="phone" />
      <p class="phone-text">010-713-22-63</p>
      <router-link to="/">Home</router-link>
      <router-link to="/menu">Menu</router-link>
      <router-link to="/contact">Contact</router-link>
      <router-link to="/auth">Sign up</router-link>
      <router-link to="/profile">My account</router-link>
      <router-link to="/cart">
        <img class="order-img" src="../assets/order-icon.svg" alt="order" />
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";

defineComponent({
  name: "Header", // Явно задаем имя компонента
});
</script>

<style scoped>
.header {
  display: flex;
  width: 90%;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  /* background-color: #f8f9fa;*/
  border-bottom: 1px solid #acacac;
}

.logo img {
  width: 50%;
}
.phone-img {
  width: 2%;
}
.order-img {
  width: 20%;
}
.phone-text {
  color: darkgreen;
}

.nav {
  display: flex;
  gap: 20px;
  align-items: center;
  /* border: 1px solid green;*/
  justify-content: center;
}

.nav a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.nav a.router-link-active {
  color: #fccc3b;
}
</style>
