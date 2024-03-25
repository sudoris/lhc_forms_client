<script setup lang="ts">
// import { loadScript, removeScript } from '@/loadExternalScript'
import { loadLForms } from 'lforms-loader'
import { onBeforeMount, onUnmounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import router from './router'


// loading 3rd party js via script tags:
// https://stackoverflow.com/questions/70965028/external-script-tag-3rd-party-javascript-with-quasar-and-vue-3
// const lhcAssetsSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/webcomponent/assets/lib/zone.min.js'
// const lhcFormsSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/webcomponent/lhc-forms.js'
// const lformsFhirAllSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/fhir/lformsFHIRAll.min.js'
onBeforeMount(async () => {
  // await loadScript(lhcAssetsSrc)
  // await loadScript(lhcFormsSrc)
  // await loadScript(lformsFhirAllSrc)
  await loadLForms('34.0.0')
})

// onUnmounted(() => removeScript(lhcAssetsSrc))
// onUnmounted(() => removeScript(lhcFormsSrc))
// onUnmounted(() => removeScript(lformsFhirAllSrc))


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
