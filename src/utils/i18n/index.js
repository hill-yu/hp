import { createI18n } from 'vue-i18n'
// 语言包
import zh from './lang/zh'
import en from './lang/en'
import fil_ph from './lang/fil'
import id from './lang/id'

const i18n = createI18n({
  legacy: false, // 设置为 false，启用 composition API 模式
  locale: sessionStorage.getItem('localeLang') || 'en',
  messages: {
    zh,
    en,
    fil_ph,
    id,
  },
})
export default i18n