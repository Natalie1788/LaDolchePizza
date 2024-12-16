import { defineStore } from "pinia";

// Тип для элемента корзины
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
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
    addToCart(pizza: CartItem) {
      // Проверяем, есть ли пицца уже в корзине
      const existingItem = this.cart.find((item) => item._id === pizza._id);

      if (existingItem) {
        // Увеличиваем количество, если уже существует
        existingItem.quantity += 1;
        console.log(
          `Increased quantity of pizza: ${pizza.name}, new quantity: ${existingItem.quantity}`
        );
      } else {
        const newPizza = { ...pizza, quantity: 1 };
        this.cart.push(newPizza);
        console.log("Added new pizza to cart:", newPizza);
        console.log("Cart contents:", this.cart);
      }
    },

    increaseQuantity(_id: string) {
      const item = this.cart.find((item) => item._id === _id);
      if (item) item.quantity++;
    },

    decreaseQuantity(_id: string) {
      const item = this.cart.find((cartItem) => cartItem._id === _id);
      if (item && item.quantity > 1) {
        item.quantity--;
      } else {
        this.removeFromCart(_id);
      }
    },

    removeFromCart(_id: string) {
      this.cart = this.cart.filter((item) => item._id !== _id);
    },

    clearCart() {
      this.cart = [];
    },
  },
});
