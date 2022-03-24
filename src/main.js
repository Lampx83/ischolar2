import {createApp} from 'vue'
import mitt from 'mitt'
import App from './App.vue'
import {router} from './routes'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const emitter = mitt()
 import {i18n} from './lang/i18n'
import {store} from './store'


const app = createApp(App).use(i18n).use(store).use(router)

// Optionally install the BootstrapVue icon components plugin

app.config.globalProperties.emitter = emitter
app.mount('#app')



