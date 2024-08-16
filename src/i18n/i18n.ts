import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enJSON from './locale/en.json'
import spJSON from './locale/sp.json'
i18n.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    sp: { ...spJSON },
  },
  lng: 'en',
})
