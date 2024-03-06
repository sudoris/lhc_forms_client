<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useLFormStore } from '@/stores/lform'
import dayjs from 'dayjs'

import type { Ref } from 'vue'

const router = useRouter()
const lFormStore = useLFormStore()

enum GroupBy {
  patient = 'patient',
  practioner = 'practioner'
}

const groupBy: Ref<string> = ref('patient')

const formatName = (fhirName) => {
  const lastName = fhirName[0].family
  const firstName = fhirName[0].given[0]
  return `${firstName} ${lastName}`
}

// temporarily concat patient name, gender, birthdate to use as unique identifier
const getPatientIdentifier = (fhirPatient) => {
  const fullName = formatName(fhirPatient.name)
  return `${fullName}${fhirPatient.gender}${fhirPatient.birthDate}`
}

const mapQuestionnaires = computed(() => {
  const questionnaires = {}
  for (const questionnaire of lFormStore.fhirQuestionnaires) {
    if (!questionnaires[questionnaire.id]) {
      questionnaires[questionnaire.id] = questionnaire
    }
  }
  return questionnaires
})

const getQuestionnaireIdFromUrl = (url) => {
  return url.substring(url.lastIndexOf('/') + 1);
}

const responsesByPatient = computed(() => {
  const groupedResponses = {} 
  for (const response of lFormStore.questionnaireResponses) {
    const patientIdentifier = getPatientIdentifier(response.contained[1])
    if (!groupedResponses[patientIdentifier as keyof typeof groupedResponses]) {
      groupedResponses[patientIdentifier as keyof typeof groupedResponses] = []
    }

    const questionnaireId = getQuestionnaireIdFromUrl(response.questionnaire)
    const genderCapitalized = response.contained[1].gender.charAt(0).toUpperCase() + response.contained[1].gender.slice(1)
    const responseTableData = {
      fullName: formatName(response.contained[1].name),
      authoringPractioner: formatName(response.contained[0].name),
      gender: genderCapitalized,
      birthDate: response.contained[1].birthDate,
      lastUpdateTime: dayjs(response.meta.lastUpdated).format('YYYY-MM-DD h:mm'),
      questionnaireType: mapQuestionnaires.value[questionnaireId].name || mapQuestionnaires.value[questionnaireId].title
    }
    groupedResponses[patientIdentifier as keyof typeof groupedResponses].push(responseTableData)
  }
  return groupedResponses
})

const handleEdit = (idx, row) => {

}

const handleDelete = (idx, row) => {

}

const viewForm = (idx, row) => {

}

</script>

<template>
  <main class="dashboard">     
    <div class="groupby-container">
      <div class="groupby-right">
        <div class="groupby-label">Group by</div>
        <el-select v-model="groupBy" placeholder="Group by" class="groupby-select">
          <el-option label="Patient" value="patient" />
          <el-option label="Author" value="practioner" />
        </el-select>
      </div>
    </div>
    <div
      v-for="responseList in responsesByPatient"
      class="response-group"
    >
      <div class="patient-name">{{ responseList[0].fullName }}  |  {{ responseList[0].gender }}  |  {{ responseList[0].birthDate }} (DOB)</div>
      <el-table :data="responseList" stripe fit>
        <el-table-column prop="questionnaireType" label="Questionnaire type" width="180" />
        <el-table-column prop="authoringPractioner" label="Authored by"/>
        <!-- <el-table-column prop="gender" label="Gender" />
        <el-table-column prop="birthDate" label="Birthdate" /> -->
        <el-table-column prop="lastUpdateTime" label="Last updated" />
        <el-table-column label="">
          <template #default="scope">
            <el-button size="small" type="success" @click="viewForm(scope.$index, scope.row)"
              >View</el-button
            >
            <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)"
              >Edit</el-button
            >
            <el-button
              type=""
              size="small"
              @click="handleDelete(scope.$index, scope.row)"
            >
              <el-icon size="large" color="red">
                <Delete />
              </el-icon>
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </main>
</template>

<style scoped>
.dashboard {
  padding: .5rem;
}
.response-group {
  margin: 1rem;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  padding: 1rem;
  box-shadow: var(--el-box-shadow-light);
}

.patient-name {
  font-weight: 500;
}

.groupby-container {
  display: flex;
  justify-content: flex-end;
  padding: 0.75rem;
}
.groupby-right {
  display: flex;
  align-items: center;
  gap: .40rem;
  flex-grow: .15;
}

.groupby-label {
  flex-shrink: 0;
}

@media only screen and (max-width: 678px) {
  .groupby-right {
    flex-grow: .40;
  }
} 
</style>
