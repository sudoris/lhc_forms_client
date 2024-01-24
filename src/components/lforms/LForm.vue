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

// practioner info
const practionerFirstName = ref('')
const practionerLastName = ref('')

// patient info
const firstName = ref('')
const lastName = ref('')
const gender = ref('')
const birthDate = ref('')

const saveFormData = () => {
  const formInput = LForms.Util.getFormFHIRData('QuestionnaireResponse', 'R4')
  const practionerInfo = {
    firstName: practionerFirstName.value,
    lastName: practionerLastName.value
  }
  const patientInfo = {
    firstName: firstName.value,
    lastName: lastName.value,
    gender: gender.value,
    birthDate: birthDate.value
  }
  lFormStore.saveFormData(formInput, patientInfo, practionerInfo)
}

const resetFormData = () => {
  selectedForm.value = ''
  setFormDef()
}
</script>

<template>
  <div class="toolbar mb-2">
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
      <button @click="saveFormData" class="btn btn-primary">Save</button>
      <button @click="resetFormData" class="btn btn-danger">Reset</button>
    </div>
  </div>

  <div>
    <div class="input-group mb-3">
      <span class="input-group-text" id="practionerFirstName">Practioner First Name</span>
      <input v-model="practionerFirstName" type="text" class="form-control" placeholder="John" aria-label="First name of practioner" aria-describedby="practionerFirstName">
    </div>    

    <div class="input-group mb-3">
      <span class="input-group-text" id="practionerLastName">Practioner Last Name</span>
      <input v-model="practionerLastName" type="text" class="form-control" placeholder="Smith" aria-label="Last name of practioner" aria-describedby="practionerLastName">
    </div>  

    <div class="input-group mb-3">
      <span class="input-group-text" id="firstname">First name</span>
      <input v-model="firstName" type="text" class="form-control" placeholder="Jane" aria-label="First name" aria-describedby="firstname">
    </div>

    <div class="input-group mb-3">
      <span class="input-group-text" id="lastname">Last name</span>
      <input v-model="lastName" type="text" class="form-control" placeholder="Doe" aria-label="Last name" aria-describedby="lastname">
    </div>

    <div class="input-group mb-3">
      <label class="input-group-text" id="gender">Gender</label>
      <select class="form-select" v-model="gender" aria-label="Gender" aria-describedby="gender">
        <option selected>Choose...</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div class="input-group mb-3">
      <span class="input-group-text" id="birthDate">birthDate</span>
      <input v-model="birthDate" type="date" class="form-control" placeholder="YYYY-MM-DD" aria-label="birthDate" aria-describedby="birthDate">
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