<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import router from './router';

const toDashBoard = () => {
  router.push({ name: 'dashboard' })
}

const toEdit = () => {
  router.push({ name: 'form' })
}
</script>

<template>
  <nav>
    <ul class="primary-nav">
      <li class="nav-item" @click="toDashBoard">
        LHC Forms Client
      </li>
      <li class="nav-item" @click="toEdit">
        + New
      </li>
    </ul>
  </nav>

  <div class="px-3 pt-2">
    <RouterView />
  </div>
</template>

<style scoped>
.primary-nav {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  align-items: center;
  margin-bottom: 0;
  color: white;
  background-color: rgb(136, 0, 0);
}

.nav-item {
  cursor: pointer;
}
</style>
