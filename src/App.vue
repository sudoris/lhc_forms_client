<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import router from './router';

const toDashBoard = () => {
  router.push({ name: 'dashboard' })
}

const toCreateNew = () => {
  router.push({ name: 'form', params: { mode: 'new' } })
}
</script>

<template>
  <nav>
    <ul class="primary-nav">
      <li class="nav-item" @click="toDashBoard">     
        <el-icon size="large" color="white">
          <Apple />
        </el-icon>
        <span>Oink</span>
      </li>
      <li class="nav-item" @click="toCreateNew">
        + New
      </li>
    </ul>
  </nav>

  <div>
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
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
