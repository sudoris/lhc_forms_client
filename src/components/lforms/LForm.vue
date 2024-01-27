<script async setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useLFormStore } from '@/stores/lform'
import { onUnmounted, onMounted, ref, computed, reactive, nextTick } from 'vue'
import { loadScript, removeScript } from '@/loadExternalScript'
import useBreakpoints from '@/hooks/useBreakpoints'
import * as dayjs from 'dayjs'

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

const computedBirthDate = computed({
  // getter
  get() {
    return patientForm.birthDate
  },
  // setter
  set(newValue) {
    patientForm.birthDate = formatDate(newValue)
  }
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

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

const selectedForm = ref('')
const setFormDef = async () => {
  lFormStore.setFormDef(selectedForm.value)
  // ensure that form definition object is set to formDef in lFormStore before we call 'LForms.Util.addFormToPage'
  await nextTick()
  if (selectedForm.value) {
    const options = { prepopulate: true }
    LForms.Util.addFormToPage(lFormStore.formDef, 'lhcFormContainer', options);
  }
}

const saveFormData = async () => {
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
  await lFormStore.saveFormData(formInput, patientInfo, practionerInfo)

  toDashBoard()
}

const resetFormData = () => {
  selectedForm.value = ''
  setFormDef()
}
</script>

<template>
  <div class="basic-profile">
    <div class="basic-profile-card">
      <div class="card-item">
        <div class="card-item-label">Patient</div>
        <div class="card-item-content">{{ `${patientForm.firstName} ${patientForm.lastName}` }}</div>
      </div>
      <div class="card-item">
        <div class="card-item-label">Gender</div>
        <div class="card-item-content">{{ `${patientForm.gender.charAt(0).toUpperCase() + patientForm.gender.slice(1)}` }}</div>
      </div>
      <div class="card-item">
        <div class="card-item-label">Birthdate</div>
        <div class="card-item-content">{{ `${patientForm.birthDate}` }}</div>
      </div>
    </div>
    <div class="basic-profile-card">
      <div class="card-item">
        <div class="card-item-label">Practioner</div>
        <div class="card-item-content">{{ `${practionerForm.practionerFirstName} ${practionerForm.practionerLastName}` }}</div>
      </div>      
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
      </div>
      
      <div class="toolbar-right">
        <template v-if="lFormStore.formDef">
          <el-button type="primary" @click="saveFormData">Save</el-button>
          <el-button type="danger" @click="resetFormData">Clear</el-button>
        </template>
      </div>
    </div>

    <div v-if="lFormStore.formDef" id="lhcFormContainer"></div>
  </div>

  <!-- Practioner/patient info dialog -->
  <el-dialog 
    v-model="showFormDialog" 
    :title="formDialogTitle" 
    :width="dialogWidth" 
    :close-on-click-modal="false" 
    :close-on-press-escape="false"
    :show-close="false"
  >
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
        <el-form-item label="Birthdate" prop="birhtdate">
          <el-date-picker
            v-model="computedBirthDate"
            type="date"
            placeholder="YYYY-MM-DD"
            class="w-100"
          />
        </el-form-item>
      </el-form>
    </template>
    <template v-if="dialogEditType == 'practioner'" #footer>
      <span class="dialog-footer">
        <el-button type="danger" @click="toDashBoard">Cancel</el-button>
        <el-button type="primary" @click="validatePractionerFields(practionerFormRef)">
          Next
        </el-button>
      </span>
    </template>
    <template v-else-if="dialogEditType == 'patient'" #footer>
      <span class="dialog-footer">
        <el-button type="info" @click="dialogEditType = 'practioner'">Back</el-button>
        <el-button type="danger" @click="toDashBoard">Cancel</el-button>      
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
  display: flex;
  padding: 1rem;
  justify-content: space-around;
  background-color: var(--el-fill-color);
}

.basic-profile-card {  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4%;
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

}

.dialog-footer {
  /* display: flex;
  justify-content: space-between; */
}

.workspace-container {
  padding: 0.5rem 0.5rem;
}

</style>