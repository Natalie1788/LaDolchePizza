<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div>
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

#app {
  text-align: center;
}
</style>
