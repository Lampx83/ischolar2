

import { createStore } from 'vuex'
import app from './main'



export const store = createStore({
    mutations: {
        SET_LANG(state, payload) {
            app.$i18n.locale = payload
        }
    },

    actions: {
        setLang({commit}, payload) {
            commit('SET_LANG', payload)
        }
    }
})