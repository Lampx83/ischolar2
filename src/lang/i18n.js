import vnMessage from './vn.json'
import enMessage from './en.json'
import {createI18n} from 'vue-i18n'


const messages = {
    vn: vnMessage,
    en: enMessage,
}

export const languages = [
    {code: "en", "name": "🇬🇧 English"},
    {code: "vn", "name": "🇻🇳 Tiếng Việt"}
]

export const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'vn',
    fallbackLocale: 'vn',
    messages: messages
})
