import { defineStore } from "pinia";
import { pizzaImages } from "@/components/PizzaImages";

// Тип для элемента корзины
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  src: string;
  alt: string;
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [] as CartItem[],
  }),

  getters: {
    totalPrice(state): number {
      return state.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
  },

  actions: {
    // Метод для сохранения корзины в localStorage
    saveCartToLocalStorage() {
      const userToken = localStorage.getItem("token") || "guest";
      const cartKey = `cart_${userToken}`;
      localStorage.setItem(cartKey, JSON.stringify(this.cart));
    },

    // Метод для загрузки корзины из localStorage
    loadCartFromLocalStorage() {
      const userToken = localStorage.getItem("token") || "guest";
      const cartKey = `cart_${userToken}`;
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        this.cart = JSON.parse(savedCart);
      }
    },
    addToCart(pizza: Omit<CartItem, "src" | "alt">) {
      const pizzaImage = pizzaImages.find(
        (image) => image.pizzaId === pizza._id
      );

      // Проверяем, есть ли пицца уже в корзине
      const existingItem = this.cart.find((item) => item._id === pizza._id);

      if (existingItem) {
        // Увеличиваем количество, если уже существует
        existingItem.quantity += 1;
        console.log(
          `Increased quantity of pizza: ${pizza.name}, new quantity: ${existingItem.quantity}`
        );
      } else {
        const newPizza = {
          ...pizza,
          quantity: 1,
          src: pizzaImage?.src || "", // Если изображение не найдено, пустая строка
          alt: pizzaImage?.alt || "", // Если альтернативный текст не найден, пустая строка
        };
        this.cart.push(newPizza);
        console.log("Added new pizza to cart:", newPizza);
        console.log("Cart contents:", this.cart);
      }
      // Сохраняем обновленное состояние корзины
      this.saveCartToLocalStorage();
    },

    increaseQuantity(_id: string) {
      const item = this.cart.find((item) => item._id === _id);
      if (item) item.quantity++;
      this.saveCartToLocalStorage(); // Сохраняем состояние корзины
    },

    decreaseQuantity(_id: string) {
      const item = this.cart.find((cartItem) => cartItem._id === _id);
      if (item && item.quantity > 1) {
        item.quantity--;
        this.saveCartToLocalStorage(); // Сохраняем состояние корзины
      } else {
        this.removeFromCart(_id);
      }
    },

    removeFromCart(_id: string) {
      this.cart = this.cart.filter((item) => item._id !== _id);
      this.saveCartToLocalStorage(); // Сохраняем состояние корзины
    },

    clearCart() {
      this.cart = [];
      this.saveCartToLocalStorage(); // Сохраняем состояние корзины
    },
  },
});
