import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/css/lhc.css'
import './assets/css/bootstrap.min.css'
import './assets/css/reset.css'
import './assets/css/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
