import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index.js'

// import formDefinition from '@/assets/form_defs/fhirPersonalHealthRecord.json'

export const useLFormStore = defineStore('lFormStore', () => {
  const fhirQuestionnaires = ref([])
  const loadFhirQuestionnaires = async () => {     
    const res = await api.listQuestionnaires()
    if (res.entry && res.entry.length) {
      fhirQuestionnaires.value = res.entry.map(item => item.resource)
    }
  }

  const formDef = ref()
  const setFormDef = (questionnaireId) => {
    formDef.value = fhirQuestionnaires.value.find(questionnaire => questionnaire.id === questionnaireId)
  }

  const formData = ref({})
  const saveFormData = (data) => {
    formData.value = data
    console.log('form data:')
    console.log(data)
  }
  
  return { formDef, formData, setFormDef, saveFormData, loadFhirQuestionnaires, fhirQuestionnaires }
})