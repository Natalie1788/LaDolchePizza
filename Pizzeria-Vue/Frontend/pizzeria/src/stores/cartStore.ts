import { defineStore } from "pinia";

// Тип для элемента корзины
export interface CartItem {
  id: string;
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
    /*addToCart(pizzas: CartItem[]) {
      pizzas.forEach((pizza) => {
        console.log("Adding pizza:", pizza);
        const existingPizza = this.cart.find((item) => item.id === pizza.id);
        if (existingPizza) {
          existingPizza.quantity += pizza.quantity || 1;
          console.log("Updated quantity:", existingPizza);
        } else {
          const newPizza = { ...pizza, quantity: pizza.quantity || 1 };
          this.cart.push(newPizza);
          console.log("Added new pizza:", newPizza);
        }
      });
      console.log("Current cart state:", this.cart);
    },*/
    /*addToCart(pizzas: CartItem | CartItem[]) {
      // Преобразуем одиночный объект в массив, если передана одна пицца
      const pizzaArray = Array.isArray(pizzas) ? pizzas : [pizzas];

      pizzaArray.forEach((pizza) => {
        console.log("Adding pizza:", pizza);

        // Проверяем, есть ли пицца с таким ID в корзине
        const existingPizza = this.cart.find((item) => item.id === pizza.id);

        if (existingPizza) {
          existingPizza.quantity += pizza.quantity || 1; // Увеличиваем количество
          console.log("Updated quantity:", existingPizza);
        } else {
          // Добавляем новую пиццу с количеством по умолчанию 1
          const newPizza = { ...pizza, quantity: pizza.quantity || 1 };
          this.cart.push(newPizza);
          console.log("Added new pizza:", newPizza);
        }
      });

      console.log("Current cart state:", this.cart);
    },*/
    addToCart(pizza: CartItem) {
      // Проверяем, есть ли пицца уже в корзине
      const existingItem = this.cart.find((item) => item.id === pizza.id);

      if (existingItem) {
        // Увеличиваем количество, если уже существует
        existingItem.quantity += 1;
        console.log(
          `Increased quantity of pizza: ${pizza.name}, new quantity: ${existingItem.quantity}`
        );
      } else {
        // Добавляем новую пиццу в корзину
        const newPizza = { ...pizza, quantity: 1 };
        this.cart.push(newPizza);
        console.log("Added new pizza to cart:", newPizza);
      }
    },

    increaseQuantity(id: string) {
      const item = this.cart.find((cartItem) => cartItem.id === id);
      if (item) item.quantity++;
    },

    decreaseQuantity(id: string) {
      const item = this.cart.find((cartItem) => cartItem.id === id);
      if (item && item.quantity > 1) {
        item.quantity--;
      } else {
        this.removeFromCart(id);
      }
    },

    removeFromCart(id: string) {
      this.cart = this.cart.filter((item) => item.id !== id);
    },

    clearCart() {
      this.cart = [];
    },
  },
});
