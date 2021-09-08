import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

/* App.vue为根组件
 * app为应用实例
 */
const app = createApp(App)
app.use(router)

console.log(app.config)

app.mount('#app')
