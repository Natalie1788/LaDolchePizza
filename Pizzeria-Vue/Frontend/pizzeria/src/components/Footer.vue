<template>
  <div class="footer">
    <div class="footer-content">
      <ul class="company-info">
        <li>Copyright © 2024. La Dolce Pizza</li>
        <li>Via del Cibo Delizioso 3, Venice, Italy</li>
        <li>Telephone: 010-713-22-63</li>
        <li>E-MAIL: ladolcepizza@gmail.com</li>
      </ul>

      <div>
        <h2>WE OPENED</h2>
        <p>All days: 10.00 - 22.00</p>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.footer {
  width: 100%;
  height: 100px;
  background-color: aliceblue;
}
.footer-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px;
  width: 90%;
}
.company-info {
  list-style: none;
}
</style>
