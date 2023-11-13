<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <ul class="primary-nav">
      <li>
        LHC Forms Client
      </li>
    </ul>
  </nav>

  <RouterView />
</template>

<style scoped>
.primary-nav {
  display: flex;
  padding: 1rem;
  align-items: center;
  margin-bottom: 0;
  color: white;
  background-color: rgb(136, 0, 0);
}
</style>
