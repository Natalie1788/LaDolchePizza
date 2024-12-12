<template>
  <div class="signin-container">
    <h2>Login</h2>

    <form @submit.prevent="loginUser">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          placeholder="Enter your email"
          required
        />
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
      </div>

      <button type="submit" :disabled="isSubmitting">Login</button>

      <p v-if="error" class="error-message">{{ error }}</p>
    </form>

    <button class="toggle-form" @click="$emit('toggleForm')">
      Don't have an account? Register
    </button>
  </div>
</template>

<script>
export default {
  emits: ["toggleForm"],
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      error: null,
      isSubmitting: false,
    };
  },
  methods: {
    async loginUser() {
      this.error = null;
      this.isSubmitting = true;

      try {
        const response = await fetch("http://localhost:5800/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.form.email,
            password: this.form.password,
          }),
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const data = await response.json(); // Предположим, что сервер возвращает объект с токеном
        const token = data.token; // Здесь 'token' — это имя поля, которое сервер возвращает

        if (token) {
          localStorage.setItem("token", token); // Сохраняем токен в localStorage
          alert("Login successful!");
          this.$router.push("/profile"); // Перенаправляем на страницу профиля
        } else {
          throw new Error("Token not found in response");
        }
      } catch (err) {
        this.error = err.message || "Something went wrong!";
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
.signin-container {
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
