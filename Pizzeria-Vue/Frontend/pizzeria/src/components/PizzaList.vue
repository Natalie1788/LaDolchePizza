<template>
  <div>
    <h1 class="pizza-header-text">Pizza assortiment</h1>
    <ul class="pizza-list" v-if="pizzas.length">
      <li class="pizza-item" v-for="(pizza, index) in pizzas" :key="pizza._id">
        <router-link :to="`/menu/${pizza._id}`">
          <img
            :src="getPizzaImage(index)?.src"
            :alt="getPizzaImage(index)?.alt || 'Pizza Image'"
            class="pizza-image"
          />

          <h3 class="pizza-name-text">{{ pizza.name }}</h3>

          <p class="pizza-price-text">
            <b>{{ pizza.price }} €</b>
          </p>

          <!-- Отображаем ингредиенты -->
          <div>
            <span
              v-for="(ingredient, index) in pizza.ingredients"
              :key="ingredient"
            >
              {{ ingredient }}
              <span v-if="index < pizza.ingredients.length - 1">, </span>
            </span>
          </div>
        </router-link>

        <div>
          <p>Comments: {{ getCommentCount(pizza._id) }}</p>
        </div>

        <!-- Кнопка добавления в заказ -->
        <button class="add-to-cart-button" @click="addToCart(pizza)">
          Add to cart
        </button>
      </li>
    </ul>
    <p v-else>Loading...</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue"; // Импорты из Vue.js 3
import axios from "axios"; // Импортируем Axios
import { pizzaImages } from "./PizzaImages";
import { useCartStore } from "@/stores/cartStore";
import { useCommentCountStore } from "@/stores/commentsStore";

export default {
  setup() {
    const pizzas = ref([]); // Список пицц
    const error = ref(null); // Ошибка, если запрос не удался
    const cartStore = useCartStore(); // Инициализация store для корзины
    const commentCountStore = useCommentCountStore();

    const getCommentCount = (pizzaId) =>
      commentCountStore.getCommentCount(pizzaId);

    // Находим картинку для пиццы
    const getPizzaImage = (index) => {
      return pizzaImages[index];
    };

    const fetchPizzas = async () => {
      try {
        const response = await axios.get("http://localhost:5800/pizzas");
        pizzas.value = response.data;
        console.log(pizzas.value);
        pizzas.value = response.data.map((pizza, index) => ({
          ...pizza,
          src: pizzaImages[index]?.src,
          alt: pizzaImages[index]?.alt || "Pizza Image",
        }));
      } catch (err) {
        console.error(err);
        error.value = "Failed to fetch pizzas.";
      }
    };

    // Добавление пиццы в корзину
    /*const addToCart = (pizza) => {
      cartStore.addToCart(pizza);
      console.log("Adding pizza to cart:", pizza);
    };*/
    const addToCart = (pizza) => {
      const cartItem = {
        _id: pizza._id.toString(), // Приведение к строке
        name: pizza.name,
        price: pizza.price,
        quantity: pizza.quantity, // Начальное количество
        src: pizza.src || getPizzaImage(index)?.src,
        alt: pizza.alt || getPizzaImage(index)?.alt || "Pizza Image",
      };
      cartStore.addToCart(cartItem);
    };

    // Переход к деталям пиццы
    const viewPizzaDetails = (id) => {
      window.location.href = `/menu/${id}`;
    };

    onMounted(fetchPizzas); // Выполняем запрос при загрузке компонента

    return {
      pizzas,
      error,
      getPizzaImage,
      addToCart,
      viewPizzaDetails,
      getCommentCount,
    }; // Возвращаем данные для использования в шаблоне
  },
};
</script>

<style scoped>
.pizza-item {
  width: 40%;
  border: 1px solid #007a27;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}
.pizza-item:hover {
  box-shadow: 0 0 5px rgba(0, 122, 47, 0.5);
  background-color: rgb(255, 231, 186);
}
.pizza-list {
  list-style: none;
  display: flex;
  width: 70%;
  margin: 0 auto;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}
.pizza-header-text {
  margin-top: 20px;
}
.pizza-image {
  width: 80%;
  height: auto;
  border-radius: 5px;
}
.pizza-name-text {
  color: rgb(9, 74, 9);
}
.pizza-price-text {
  color: rgb(92, 24, 0);
}
.add-to-cart-button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-to-cart-button:hover {
  background-color: #218838;
}
</style>
