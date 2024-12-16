<template>
  <div>
    <h1>Your Cart</h1>
    <ol class="cart-list" v-if="cartStore.cart.length">
      <li v-for="item in cartStore.cart" :key="item.id" class="cart-item">
        <h3>{{ item.name }}</h3>
        <p>Price: {{ item.price }}$</p>
        <div class="btn-container">
          <button
            class="quantity-btn"
            @click="cartStore.decreaseQuantity(item._id)"
          >
            -
          </button>
          <span>{{ item.quantity }}</span>
          <button
            class="quantity-btn"
            @click="cartStore.increaseQuantity(item._id)"
          >
            +
          </button>

          <button
            class="remove-btn"
            @click="cartStore.removeFromCart(item._id)"
          >
            Remove
          </button>
        </div>
      </li>

      <h2>Total: {{ cartStore.totalPrice }}$</h2>
      <button class="place-order-btn" @click="placeOrder">Place Order</button>
    </ol>
    <div v-else>
      <p>Your cart is empty.</p>
      <router-link to="/menu">Go back to Menu</router-link>
    </div>
  </div>
</template>

<script>
import { useCartStore } from "../stores/cartStore";
import { onMounted } from "vue";

export default {
  setup() {
    const cartStore = useCartStore();

    // Загружаем корзину при монтировании компонента
    onMounted(() => {
      cartStore.loadCartFromLocalStorage();
    });

    const placeOrder = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to place an order!");
        return;
      }

      const orderData = {
        pizza: cartStore.cart.map((item) => ({
          _id: item._id,
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

<style scoped>
h1 {
  text-align: center;
}
.cart-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center;*/
  gap: 15px;
  width: 30%;
  margin: 20px auto;
  border: 1px solid darkgreen;
  border-radius: 5px;
  padding: 20px;
}
.quantity-btn,
.remove-btn {
  background-color: rgb(153, 228, 140);
  padding: 3px 15px;
  border-radius: 5px;
}
.btn-container {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.place-order-btn {
  background-color: rgb(235, 185, 91);
  padding: 10px 20px;
  border-radius: 5px;
}
</style>
