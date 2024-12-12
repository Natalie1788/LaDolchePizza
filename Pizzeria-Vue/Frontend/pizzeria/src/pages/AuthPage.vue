<template>
  <div class="auth-wrapper">
    <RegisterForm v-if="isRegistering" @toggleForm="toggleForm" />
    <SignInForm v-else @toggleForm="toggleForm" />
  </div>
</template>

<script>
import { ref } from "vue";
import RegisterForm from "@/components/RegisterForm.vue";
import SignInForm from "@/components/SignInForm.vue";

export default {
  components: {
    RegisterForm,
    SignInForm,
  },
  setup() {
    const isRegistering = ref(false); // Начнем с формы регистрации

    // Функция для переключения между формами
    const toggleForm = () => {
      isRegistering.value = !isRegistering.value;
    };

    return {
      isRegistering,
      toggleForm,
    };
  },
};
</script>

<style scoped>
/* Стили для родительского компонента */
</style>
