<script setup>
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import PrivacyPolicy from '@/components/PrivacyPolicy.vue'
import UserAgreement from '@/components/UserAgreement.vue'
import { docuLocation } from '@/utils/utils'
const route = useRoute()
const components = {
  'privacypolicy': PrivacyPolicy,
  'useragreement': UserAgreement
}
const currentComponent = computed(() => {
  const componentName = route.params.name
  return components[componentName] || UserAgreement
})
onMounted(() => {
  docuLocation('show')
})
</script>

<template>
  <div class="ClauseContainer">
    <component :is="currentComponent"></component>
  </div>
</template>
<style scoped>
.ClauseContainer {
  padding: 2rem;
}
</style>
