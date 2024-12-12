<template>
  <div class="logout-container">
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      // Удаляем токен из localStorage
      localStorage.removeItem("token");

      // Перенаправляем на страницу логина
      this.$router.push("/login");
    },
  },
};
</script>
