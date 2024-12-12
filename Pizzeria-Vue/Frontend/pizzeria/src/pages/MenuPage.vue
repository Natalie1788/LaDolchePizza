<template>
  <div class="menu">
    <h1>Our Menu</h1>
    <p>Check out our delicious pizza options!</p>
    <PizzaList />
  </div>
</template>

<script setup>
import PizzaList from "@/components/PizzaList.vue";
</script>

<style scoped>
.menu {
  text-align: center;
  margin-top: 50px;
}
</style>
