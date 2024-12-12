<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="registerUser">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="form.username"
          placeholder="Enter your username"
          required
        />
        <p v-if="errors.username" class="error-message">
          {{ errors.username.join(", ") }}
        </p>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          placeholder="Enter your email"
          required
        />
        <p v-if="errors.email" class="error-message">
          {{ errors.email.join(", ") }}
        </p>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          placeholder="Enter your password"
          required
        />
        <p v-if="errors.password" class="error-message">
          {{ errors.password.join(", ") }}
        </p>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="form.confirmPassword"
          placeholder="Confirm your password"
          required
        />
        <p v-if="errors.confirmPassword" class="error-message">
          {{ errors.confirmPassword.join(", ") }}
        </p>
      </div>

      <button type="submit" :disabled="isSubmitting">Register</button>
    </form>

    <button class="toggle-form" @click="$emit('toggleForm')">
      Already have an account? Login
    </button>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  emits: ["toggleForm"], // Указываем, что компонент может эмитировать событие "toggleForm"
  setup() {
    const form = ref({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    const errors = ref({}); // Хранение ошибок по каждому полю
    const isSubmitting = ref(false);

    const registerUser = async () => {
      if (form.value.password !== form.value.confirmPassword) {
        errors.value = { confirmPassword: ["Passwords do not match!"] };
        return;
      }

      // Очистка ошибок
      errors.value = {};
      isSubmitting.value = true;

      try {
        const response = await fetch("http://localhost:5800/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: form.value.username,
            email: form.value.email,
            password: form.value.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.errors) {
            // Преобразование ошибок от сервера
            errorData.errors.forEach((err) => {
              errors.value[err.field] = err.errors;
            });
          } else {
            throw new Error(errorData.message || "Registration failed");
          }
          return;
        }

        alert("Registration successful!");
        // Например, перенаправление после успешной регистрации
        // router.push("/login");
      } catch (err) {
        alert(err.message || "Something went wrong!");
      } finally {
        isSubmitting.value = false;
      }
    };

    return { form, registerUser, errors, isSubmitting };
  },
};
</script>

<style scoped>
.register-container {
  width: 300px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  /*background-color: #f9f9f9;*/
}

h2 {
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 90%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

.error-message {
  color: red;
  font-size: 14px;
  text-align: center;
}
.toggle-form {
  margin-top: 10px;
  background: none;
  border: none;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
</style>
