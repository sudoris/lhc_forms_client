<script async setup lang="ts">
import { useLFormStore } from '@/stores/lform'
import { onUnmounted, onMounted, ref } from 'vue'
import { loadScript, removeScript } from '@/loadExternalScript'

const lFormStore = useLFormStore()

// loading 3rd party js via script tags:
// https://stackoverflow.com/questions/70965028/external-script-tag-3rd-party-javascript-with-quasar-and-vue-3
const lhcAssetsSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/webcomponent/assets/lib/zone.min.js'
const lhcFormsSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/webcomponent/lhc-forms.js'
const lformsFhirAllSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/fhir/lformsFHIRAll.min.js'
onMounted(async () => {
  await lFormStore.loadFhirQuestionnaires()
  await loadScript(lhcAssetsSrc)
  await loadScript(lhcFormsSrc)
  await loadScript(lformsFhirAllSrc)
})

onUnmounted(() => removeScript(lhcAssetsSrc))
onUnmounted(() => removeScript(lhcFormsSrc))
onUnmounted(() => removeScript(lformsFhirAllSrc))

const selectedForm = ref('')
const setFormDef = () => {
  lFormStore.setFormDef(selectedForm.value)
  if (selectedForm.value) {
    const options = { prepopulate: true }
    LForms.Util.addFormToPage(lFormStore.formDef, 'lhcFormContainer', options);
  }
}

const saveFormData = () => {
  const formInput = LForms.Util.getFormFHIRData('QuestionnaireResponse', 'R4')
  lFormStore.saveFormData(formInput)
}

const resetFormData = () => {
  selectedForm.value = ''
  setFormDef()
}
</script>

<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <select 
        v-model="selectedForm" 
        @change.prevent="setFormDef"
      >
        <option disabled value="">Choose a questionnaire</option>
        <option v-for="questionnaire in lFormStore.fhirQuestionnaires" 
          :key="questionnaire.id"
          :value="questionnaire.id"
        >
          {{ questionnaire.name || questionnaire.title }}
        </option>
      </select>
    </div>
    <div class="toolbar-right">
      <button @click="saveFormData" class="save-btn">Save</button>
      <button @click="resetFormData" class="reset-btn">Reset</button>
    </div>
  </div>

  <div v-show="lFormStore.formDef" id="lhcFormContainer"></div>
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  align-items: center;
  margin-top: 0.25rem;
}

.toolbar-left {

}

.toolbar-right {
  display: flex;
  gap: 0.5rem;
}

.save-btn {
}

.reset-btn {
}
</style>