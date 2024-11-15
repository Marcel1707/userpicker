import './assets/main.css'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { createApp } from 'vue'
import App from './App.vue'
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ToastService from 'primevue/toastservice';

const app = createApp(App);
app.use(ToastService);
app.component("Button", Button);
app.component("Dialog", Dialog)

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})
app.mount('#app')
