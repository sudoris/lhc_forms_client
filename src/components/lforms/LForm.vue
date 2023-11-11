<script async setup lang="ts">
import { useLFormStore } from '@/stores/lform'
import { onUnmounted, onMounted } from 'vue'
import { loadScript, removeScript } from '@/loadExternalScript'

const lFormStore = useLFormStore()

// loading 3rd party js via script tags:
// https://stackoverflow.com/questions/70965028/external-script-tag-3rd-party-javascript-with-quasar-and-vue-3
const lhcAssetsSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/webcomponent/assets/lib/zone.min.js'
const lhcFormsSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/webcomponent/lhc-forms.js'
const lformsFhirAllSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/fhir/lformsFHIRAll.min.js'
onMounted(async () => {
  await loadScript(lhcAssetsSrc)
  await loadScript(lhcFormsSrc)
  await loadScript(lformsFhirAllSrc)
  const options = { prepopulate: true }
  LForms.Util.addFormToPage(lFormStore.formDef, 'lhcFormContainer', options);
})

onUnmounted(() => removeScript(lhcAssetsSrc))
onUnmounted(() => removeScript(lhcFormsSrc))
onUnmounted(() => removeScript(lformsFhirAllSrc))

const saveFormData = () => {
  const formInput = LForms.Util.getFormFHIRData('QuestionnaireResponse', 'R4')
  lFormStore.saveFormData(formInput)
}

const resetFormData = () => {
  
}
</script>

<template>
  <div class="toolbar">
    <button @click="saveFormData">Save</button>
    <button @click="resetFormData">Reset</button>
  </div>

  <div id="lhcFormContainer"></div>
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.25rem;
  align-items: center;
  margin-bottom: 0;
}
</style>