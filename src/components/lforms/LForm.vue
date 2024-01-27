<script async setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useLFormStore } from '@/stores/lform'
import { onUnmounted, onMounted, ref, computed, reactive } from 'vue'
import { loadScript, removeScript } from '@/loadExternalScript'
import useBreakpoints from '@/hooks/useBreakpoints'

import type { FormInstance } from 'element-plus'

const router = useRouter()
const route = useRoute()
const lFormStore = useLFormStore()
const { width: screenWidth, type: breakpointType } = useBreakpoints()

// loading 3rd party js via script tags:
// https://stackoverflow.com/questions/70965028/external-script-tag-3rd-party-javascript-with-quasar-and-vue-3
const lhcAssetsSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/webcomponent/assets/lib/zone.min.js'
const lhcFormsSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/webcomponent/lhc-forms.js'
const lformsFhirAllSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/fhir/lformsFHIRAll.min.js'
onMounted(async () => {
  console.log()
  await lFormStore.loadFhirQuestionnaires()
  await loadScript(lhcAssetsSrc)
  await loadScript(lhcFormsSrc)
  await loadScript(lformsFhirAllSrc)
})

onUnmounted(() => removeScript(lhcAssetsSrc))
onUnmounted(() => removeScript(lhcFormsSrc))
onUnmounted(() => removeScript(lformsFhirAllSrc))

const dialogWidth = computed(() => {
  if (breakpointType.value === 'sm') {
    return '85%'
  }
  return '50%'
})

const toDashBoard = () => {
  router.push({ name: 'dashboard' })
}

const mode = computed(() => {
  if (route.params.mode !== 'new' && route.params.mode !== 'edit') {
    return 'new'
  }
  return route.params.mode
})

// control dialog for editing practioner or patient info
const showFormDialog = ref(true)

// controls dialog content type
// practioner | patient
const dialogEditType = ref('practioner')

const formDialogTitle = computed(() => {
  return dialogEditType.value === 'practioner' ? 'Practioner profile' : 'Patient profile'
})

interface PractionerForm {
  practionerFirstName: string
  practionerLastName: string
  practionerId: string
}

interface PatientForm {
  firstName: string
  lastName: string
  gender: string
  birthDate: string
  patientId: string
}

const practionerForm = reactive<PractionerForm>({
  practionerFirstName: '',
  practionerLastName: '',
  practionerId: ''
})
const patientForm = reactive<PatientForm>({
  firstName: '',
  lastName: '',
  gender: '',
  birthDate: '',
  patientId: ''
})

const practionerFormRef = ref(null)
const practionerValidationRules = reactive({
  practionerFirstName: [
    { required: true, message: 'Required', trigger: ['change', 'blur'] }
  ],
  practionerLastName: [
    { required: true, message: 'Required', trigger: ['change', 'blur'] }
  ]
})

const patientFormRef = ref(null)
const patientValidationRules = reactive({
  firstName: [
    { required: true, message: 'Required', trigger: ['change', 'blur'] }
  ],
  lastName: [
    { required: true, message: 'Required', trigger: ['change', 'blur'] }
  ],
  gender: [
    { required: true, message: 'Required', trigger: ['change', 'blur'] }
  ],
  birthDate: [
    { required: true, message: '', trigger: ['change', 'blur'] }
  ]
})

const validatePractionerFields = async (formEl: FormInstance | undefined | null) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      dialogEditType.value = 'patient'
    } else {
      console.log('missing fields for practioner', fields)
    }
  })
}

const validatePatientFields = async (formEl: FormInstance | undefined | null) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      dialogEditType.value = ''
      showFormDialog.value = false
    } else {
      console.log('missing fields for patient', fields)
    }
  })
}

// const isValidPractionerProfile = computed(() => {
//   if (!patientPractionerForm.practionerFirstName || !patientPractionerForm.practionerLastName) {
//     return false
//   }
//   return true
// })

// const isValidPatientProfile = computed(() => {
//   const requiredFields = ['firstName', 'lastName', 'gender', 'birthDate']
//   for (const field of requiredFields) {
//     if (!patientPractionerForm[field as keyof typeof patientPractionerForm]) return false
//   }
//   return true
// })

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
  const practionerInfo = {
    firstName: practionerForm.practionerFirstName,
    lastName: practionerForm.practionerLastName
  }
  const patientInfo = {
    firstName: patientForm.firstName,
    lastName: patientForm.lastName,
    gender: patientForm.gender,
    birthDate: patientForm.birthDate
  }
  lFormStore.saveFormData(formInput, patientInfo, practionerInfo)
}

const resetFormData = () => {
  selectedForm.value = ''
  setFormDef()
}
</script>

<template>
  <div class="basic-profile">
    <div class="basic-profile-card">
      XXX
    </div>
    <div class="basic-profile-card">
      OOO
    </div>
  </div>

  <div class="workspace-container">
    <div class="toolbar mb-2">
      <div class="toolbar-left">
        <el-select v-model="selectedForm" @change="setFormDef" placeholder="Questionnaire type">
          <el-option v-for="questionnaire in lFormStore.fhirQuestionnaires" 
            :key="questionnaire.id"
            :label="questionnaire.name || questionnaire.title"
            :value="questionnaire.id"
          />
        </el-select>
        <!-- <select 
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
        </select> -->
      </div>
      
      <div class="toolbar-right">
        <el-button type="primary" @click="saveFormData">Save</el-button>
        <el-button type="danger" @click="resetFormData">Clear</el-button>
      </div>
    </div>

    <div v-if="lFormStore.formDef" id="lhcFormContainer"></div>
  </div>

  <!-- Practioner/patient info dialog -->
  <el-dialog v-model="showFormDialog" :title="formDialogTitle" :width="dialogWidth">
    <template v-if="dialogEditType == 'practioner'">
      <el-form 
        ref="practionerFormRef"
        :rules="practionerValidationRules"
        :model="practionerForm" 
        label-width="auto"
      >   
        <el-form-item label="First name" prop="practionerFirstName">
          <el-input v-model="practionerForm.practionerFirstName" placeholder="First name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Last name" prop="practionerLastName">
          <el-input v-model="practionerForm.practionerLastName" placeholder="Last name" autocomplete="off" />
        </el-form-item>
      </el-form>
    </template>

    <template v-else-if="dialogEditType == 'patient'">
      <el-form 
        ref="patientFormRef"
        :rules="patientValidationRules"
        :model="patientForm" 
        label-width="auto"
      >   
        <el-form-item label="First name" prop="firstName">
          <el-input v-model="patientForm.firstName" placeholder="First name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Last name" prop="lastName">
          <el-input v-model="patientForm.lastName" placeholder="Last name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Gender" prop="gender">
          <el-select v-model="patientForm.gender" placeholder="Gender">
            <el-option label="Male" value="male" />
            <el-option label="Female" value="female" />
            <el-option label="Other" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="Birthdate">
          <el-date-picker
            v-model="patientForm.birthDate"
            type="date"
            placeholder="YYYY-MM-DD"
            class="w-100"
          />
        </el-form-item>
      </el-form>
    </template>
    <template v-if="dialogEditType == 'practioner'" #footer>
      <span class="dialog-footer">
        <el-button @click="toDashBoard">Cancel</el-button>
        <el-button type="primary" @click="validatePractionerFields(practionerFormRef)">
          Next
        </el-button>
      </span>
    </template>
    <template v-else-if="dialogEditType == 'patient'" #footer>
      <span class="dialog-footer">
        <el-button @click="toDashBoard">Cancel</el-button>
        <el-button @click="dialogEditType = 'practioner'">Back</el-button>
        <el-button type="primary" @click="validatePatientFields(patientFormRef)">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
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
  background-color: var(--el-fill-color);
}

.workspace-container {
  padding: 0.5rem 0.5rem;
}

</style>