import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index.js'

import formDefinition from '@/assets/form_defs/fhirPersonalHealthRecord.json'

export const useLFormStore = defineStore('lFormStore', () => {
  const formDef = ref(formDefinition)
  const loadFormDef = () => {}

  const formData = ref({})
  const saveFormData = (data) => {
    formData.value = data
    console.log('uploading form data')
    console.log(data)
  }
  
  return { formDef, formData, saveFormData }
})