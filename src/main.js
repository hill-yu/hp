import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vantConfig from './utils/vantConfig'
import {docuLocation} from './utils/utils'
// i18n
import i18n from './utils/i18n/index'

import LoadPage from './components/public/LoadPage.vue'
const app = createApp(App)
console.log('MODE',import.meta.env.MODE)


vantConfig(app)
app.mixin({
    mounted() {
      window.goBack = this.handleGoBack
    },
    beforeUnmount() {
    },
    methods: {
      handleGoBack() {
        const currentRoute = this.$route.name;
        console.log("currentRoute",currentRoute);
        // 检查是否是初始路由
        if (['invite', 'exchange', 'newcomerReward','clause'].includes(currentRoute)) {
                console.log('close');
              docuLocation('close')
        } else {
            console.log('go back');
            docuLocation('back')
            this.$router.back(); // 返回上一级路由
        }
      },
    },
});
app.component('LoadPage',LoadPage)
app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
