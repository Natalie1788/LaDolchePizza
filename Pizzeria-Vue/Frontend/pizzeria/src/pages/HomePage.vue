<template>
  <div class="home">
    <h1>Welcome to Our Pizzeria!</h1>
    <p>Discover the best pizza in town.</p>
    <img class="pizza-img" src="../assets/pizza-picture1.svg" alt="pizza" />
    <div class="pizza-options">
      <div>
        <h3>Fast delivery</h3>
        <img class="del-img" src="../assets/delivery-icon.svg" alt="delivery" />
      </div>
      <div>
        <h3>Hign quality ingrediens</h3>
        <img class="leaf-img" src="../assets/leaf-icon.svg" alt="delivery" />
      </div>
      <div>
        <h3>Our favourites</h3>
        <img class="star-img" src="../assets/star-icon.svg" alt="delivery" />
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.home {
  text-align: center;
  margin-top: 50px;
}
.pizza-img {
  width: 40%;
}
.pizza-options {
  width: 100%;
  height: 250px;
  background-color: #ffcb74ff;
  margin-top: -5px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.del-img {
  width: 50%;
}

.leaf-img {
  width: 40%;
}
.star-img {
  width: 40%;
}
</style>
