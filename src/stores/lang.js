import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useLangStore = defineStore('lang', () => {
    const language = ref(sessionStorage.getItem('localeLang') || 'en')
    const version = ref('')
    function changeLang(data='en',version_value) {
        sessionStorage.setItem('localeLang',data)
        language.value = data
        version.value = version_value
    }
    return { language, version,changeLang }
})