<script async setup lang="ts">
import { onUnmounted, onMounted } from 'vue'
import { loadScript, removeScript } from '../loadExternalScript'
import formDefinition from '../assets/formDefs/fhirPersonalHealthRecord.json'

const lhcAssetsSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/webcomponent/assets/lib/zone.min.js'
const lhcFormsSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/webcomponent/lhc-forms.js'
const lformsFhirAllSrc = 'https://clinicaltables.nlm.nih.gov/lforms-versions/34.0.0/fhir/lformsFHIRAll.min.js'
onMounted(async () => {
  await loadScript(lhcAssetsSrc)
  await loadScript(lhcFormsSrc)
  await loadScript(lformsFhirAllSrc)
  const options = { prepopulate: true }
  LForms.Util.addFormToPage(formDefinition, 'myFormContainer', options);
})

onUnmounted(() => removeScript(lhcAssetsSrc))
onUnmounted(() => removeScript(lhcFormsSrc))
onUnmounted(() => removeScript(lformsFhirAllSrc))
</script>

<template>
  <div id="myFormContainer"></div>
</template>
