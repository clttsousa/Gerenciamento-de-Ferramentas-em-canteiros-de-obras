import { createApp } from 'vue';
import App from './App.vue';
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

// Adicione o Toast como um plugin
app.use(Toast, {
  position: POSITION.TOP_RIGHT, // Posição das notificações
});

app.mount('#app');