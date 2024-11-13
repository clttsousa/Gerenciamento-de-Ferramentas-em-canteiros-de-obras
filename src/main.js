import { createApp } from 'vue';
import App from './App.vue';
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './axiosConfig'; 
const app = createApp(App);


app.use(Toast, {
  position: POSITION.TOP_RIGHT, 
});

app.mount('#app');