import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index.js'

const SYSTEM_URI = 'urn:uuid:0f7533a9-8a99-4666-9a7d-d435937cdef5'

// import formDefinition from '@/assets/form_defs/fhirPersonalHealthRecord.json'

export const useLFormStore = defineStore('lFormStore', () => {
  const fhirQuestionnaires = ref([])
  const loadFhirQuestionnaires = async () => {     
    const res = await api.listQuestionnaires()
    if (res.entry && res.entry.length) {
      fhirQuestionnaires.value = res.entry.map(item => item.resource)
    }
  }

  const questionnaireResponses = ref([])
  const loadQuestionnaireResponses = async () => {     
    const res = await api.listQuestionnaireResponses()
    if (res.entry && res.entry.length) {
      questionnaireResponses.value = res.entry.map(item => item.resource)
    }
  }

  const formDef = ref()
  const setFormDef = (questionnaireId) => {
    formDef.value = fhirQuestionnaires.value.find(questionnaire => questionnaire.id === questionnaireId)
  }

  const formData = ref({})
  const saveFormData = async (data, patientInfo, practitionerInfo) => {
    if (!data.contained) {
      data.contained = []
    }

    if (!data.author) {
      data.author = {
        reference: '#authoring_practitioner'
      }
      const practitioner = {
        resourceType: 'Practitioner',
        id: '#authoring_practitioner',
        identifer: [{}],
        name: [{
          use : 'official',
          family : practitionerInfo.lastName,
          given : [practitionerInfo.firstName],
          suffix : []
        }],
      }
      data.contained.push(practitioner)
    }
    if (!data.subject) {
      data.subject = {
        reference: '#subject_patient'
      }
      const patient = {
        resourceType: 'Patient',
        id: '#subject_patient',
        identifer: [{}],
        name: [{
          use: 'official',
          family: patientInfo.lastName,
          given: [patientInfo.firstName]
        }],
        birthDate: patientInfo.birthDate,
        _birthDate : {
          extension : [{
            "url" : "http://hl7.org/fhir/StructureDefinition/patient-birthTime",
            valueDateTime : ""
          }]
        },
        gender: patientInfo.gender == undefined ? 'unknown' : patientInfo.gender
      }
      data.contained.push(patient)
    }

    if (!data.meta?.source) {
      data.meta.source = SYSTEM_URI
    }
    
    formData.value = data
    console.log('form data:')
    console.log(data)
    await api.saveQuestionnaireResponse(formData.value)
  }
  
  return { formDef, formData, setFormDef, saveFormData, loadFhirQuestionnaires, fhirQuestionnaires, loadQuestionnaireResponses, questionnaireResponses }
})