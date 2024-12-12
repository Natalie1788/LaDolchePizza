<template>
  <div>
    <h1>Your Cart</h1>
    <ul v-if="cartStore.cart.length">
      <li v-for="item in cartStore.cart" :key="item.id" class="cart-item">
        <h3>{{ item.name }}</h3>
        <p>Price: {{ item.price }}$</p>
        <div>
          <button @click="cartStore.decreaseQuantity(item.id)">-</button>
          <span>{{ item.quantity }}</span>
          <button @click="cartStore.increaseQuantity(item.id)">+</button>
        </div>
        <button @click="cartStore.removeFromCart(item.id)">Remove</button>
      </li>

      <h2>Total: {{ cartStore.totalPrice }}$</h2>
      <button @click="placeOrder">Place Order</button>
    </ul>
    <div v-else>
      <p>Your cart is empty.</p>
      <router-link to="/menu">Go back to Menu</router-link>
    </div>
  </div>
</template>

<script>
import { useCartStore } from "../stores/cartStore";

export default {
  setup() {
    const cartStore = useCartStore();

    const placeOrder = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to place an order!");
        return;
      }

      const orderData = {
        pizza: cartStore.cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };
      console.log(orderData);
      // const pizzaIds = orderData.pizza.map((item) => item.id);

      try {
        const response = await fetch("http://localhost:5800/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          throw new Error("Failed to place order");
        }

        alert("Order placed successfully!");
        cartStore.clearCart();
      } catch (error) {
        console.error(error);
        alert("Something went wrong");
      }
    };

    return { cartStore, placeOrder };
  },
};
</script>
