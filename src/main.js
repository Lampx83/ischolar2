import {createApp} from 'vue'
import mitt from 'mitt'
import App from './App.vue'
 import {router} from './routes'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";


const emitter = mitt()
const app = createApp(App).use(router)
app.config.globalProperties.emitter = emitter
app.mount('#app')


