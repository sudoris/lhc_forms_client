<script async setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useLFormStore } from '@/stores/lform'
import { onUnmounted, onMounted, ref, computed, reactive, nextTick } from 'vue'
// import { loadScript, removeScript } from '@/loadExternalScript'
import useBreakpoints from '@/hooks/useBreakpoints'
import dayjs from 'dayjs'

import type { FormInstance } from 'element-plus'

const router = useRouter()
const route = useRoute()
const lFormStore = useLFormStore()
const { width: screenWidth, type: breakpointType } = useBreakpoints()

const props = defineProps({
  response: {
    type: Object,
    required: true
  }
})

const responseHistory = ref([])
const loadHistory = async () => {
  responseHistory.value = await lFormStore.getQuestionnaireResponseHistory(props.response.questionnaireResponseId)
}

const currentResponse = ref({})

const getQuestionnaireIdFromUrl = (url: string) => {
  return url.substring(url.lastIndexOf('/') + 1);
}

// loading 3rd party js via script tags:
// https://stackoverflow.com/questions/70965028/external-script-tag-3rd-party-javascript-with-quasar-and-vue-3
// const lhcAssetsSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/webcomponent/assets/lib/zone.min.js'
// const lhcFormsSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/webcomponent/lhc-forms.js'
// const lformsFhirAllSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/fhir/lformsFHIRAll.min.js'
onMounted(async () => {
  await loadHistory()
  if (!responseHistory.value.length) return
  // #TODO: verify that the index of the most recent response is actually 0
  currentResponse.value = responseHistory.value[0]
  // try {
  //   await loadScript(lhcAssetsSrc)
  //   await loadScript(lhcFormsSrc)
  //   await loadScript(lformsFhirAllSrc)
  // } catch(e) {
  //   console.log(e)
  // }
  const questionnaireId = getQuestionnaireIdFromUrl(currentResponse.value.questionnaire)
  lFormStore.setFormDef(questionnaireId)
  await mergeFormDef(currentResponse.value)
})

// onUnmounted(() => removeScript(lhcAssetsSrc))
// onUnmounted(() => removeScript(lhcFormsSrc))
// onUnmounted(() => removeScript(lformsFhirAllSrc))

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

const mergeFormDef = async (fhirData) => {
  const lhcFormDef = LForms.Util.convertFHIRQuestionnaireToLForms(lFormStore.formDef, 'R4')
  const mergedFormDef = LForms.Util.mergeFHIRDataIntoLForms('QuestionnaireResponse', fhirData, lhcFormDef, 'R4')
  lFormStore.formDef = mergedFormDef
  // ensure that form definition object is set to formDef in lFormStore before we call 'LForms.Util.addFormToPage'
  await nextTick()
  const options = { prepopulate: true }
  LForms.Util.addFormToPage(lFormStore.formDef, 'lhcFormEditorContainer', options)
}

const saveFormData = async () => {
  // save updated questionnaire response
  const lhcFormInput = LForms.Util.getFormFHIRData('QuestionnaireResponse', 'R4', 'lhcFormEditorContainer')
  const payload = { ...currentResponse.value, ...lhcFormInput }
  // formInput.author = currentResponse.value.author
  // formInput.contained = currentResponse.value.contained
  // formInput.subject = currentResponse.value.subject
  // formInput.meta.source = currentResponse.value.meta.source
  // formInput.questionnaire = currentResponse.value.questionnaire
  await lFormStore.updateFormData(payload.id, payload)

  await lFormStore.loadQuestionnaireResponses()
}
</script>

<template>
  <div class="main">
    <div class="workspace-container">
      <div class="toolbar mb-2">
        <div class="toolbar-left">          
        </div>
        
        <div class="toolbar-right">
          <template v-if="lFormStore.formDef">
            <el-button type="primary" @click="saveFormData">Submit</el-button>
          </template>
        </div>
      </div>

      <div v-if="lFormStore.formDef" id="lhcFormContainer"></div>
    </div>

    <div class="basic-profile">
      <div class="basic-profile-card">
        <div class="card-item">
          <div class="card-item-label">Patient</div>
          <div class="card-item-content">{{ `${response.fullName}` }}</div>
        </div>
        <div class="card-item">
          <div class="card-item-label">Gender</div>
          <div class="card-item-content">{{ `${response.gender}` }}</div>
        </div>
        <div class="card-item">
          <div class="card-item-label">Birthdate</div>
          <div class="card-item-content">{{ `${response.birthDate}` }}</div>
        </div>
      </div>
      <div class="basic-profile-card">
        <div class="card-item">
          <div class="card-item-label">Practioner</div>
          <div class="card-item-content">{{ `${response.authoringPractioner}` }}</div>
        </div>      
      </div>
    </div>

    <div v-if="lFormStore.formDef" id="lhcFormEditorContainer"></div>
  </div>
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
  min-width: 50%
}

.toolbar-right {
  display: flex;
  gap: 0.5rem;
}

.basic-profile {
  display: flex;
  padding: 1rem;
  justify-content: space-around;
  background-color: var(--el-fill-color);
  margin-bottom: 0.5rem;
}

.basic-profile-card {  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2%;
  gap: .5rem;
  width: 100%;
  background-color: var(--el-bg-color-overlay);
  border-radius: var(--el-border-radius-base);
}

.card-item-label {
  font-weight: 400;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-regular);
  /* line-height: 20px; */
}

.card-item-content {
  /* font-weight: 500; */
  /* font-size: var(--el-font-size-medium); */
}

.dialog-footer {
  /* display: flex;
  justify-content: space-between; */
}

.main {
  padding: 0.5rem 0.5rem;
}

</style>