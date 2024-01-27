<script setup lang="ts">
import { useRouter } from 'vue-router'
// import { computed } from 'vue'
import { useLFormStore } from '@/stores/lform'

const router = useRouter()
const lFormStore = useLFormStore()

const formatName = (fhirName) => {
  const lastName = fhirName[0].family
  const firstName = fhirName[0].given[0]
  return `${firstName} ${lastName}`
}


const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

</script>

<template>
  <main class="dashboard">
    <div 
      v-for="response in lFormStore.questionnaireResponses"
      class="p-2"
    >
      <div>
        Questionnaire: {{ response.questionnaire }} 
      </div>
      <div>
        Practioner: {{ formatName(response.contained[0].name) }}
      </div>
      <div>
        Patient: {{ formatName(response.contained[1].name) }}
      </div>
    </div>

    <!-- <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">First</th>
          <th scope="col">Last</th>
          <th scope="col">Handle</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td colspan="2">Larry the Bird</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </table> -->
  </main>
</template>
