<template>
  <div id="app">
    <div class="background-image"></div>
    <transition name="carousel">
      <component
        :is="currentComponent"
        @switch-to-register="showRegister"
        @switch-to-login="showLogin"
        @login-success="handleLoginSuccess"
      />
    </transition>
    <AppDashboard v-if="isLoggedIn" :username="username" :userId="userId" @logout="handleLogout" />
  </div>
</template>

<script>
import LoginForm from './components/LoginForm.vue'; 
import RegisterForm from './components/Register.vue';
import AppDashboard from './components/AppDashboard.vue'; 
import 'bootstrap/dist/css/bootstrap.min.css';

export default {
  name: 'App',
  components: {
    LoginForm,
    RegisterForm,
    AppDashboard 
  },
  data() {
    return {
      currentComponent: 'LoginForm',
      isLoggedIn: false, 
      username: '',
      userId: '' // Adicione esta propriedade para armazenar o ID do usuário
    };
  },
  methods: {
    showRegister() {
      this.currentComponent = 'RegisterForm';
    },
    showLogin() {
      this.currentComponent = 'LoginForm';
    },
    handleLoginSuccess(username, userId) {
      console.log('Login bem-sucedido:', username, userId);
      this.username = username; 
      this.userId = userId; // Armazena o ID do usuário ao fazer login
      console.log('User ID armazenado:', this.userId);
      this.isLoggedIn = true;   
      this.currentComponent = ''; 
    },
    handleLogout() {
      this.isLoggedIn = false; 
      this.username = '';       
      this.userId = ''; // Reseta o ID do usuário ao fazer logout
      this.currentComponent = 'LoginForm'; 
    }
  }
};
</script>

<style>
html, body {
  height: 100%;
  margin: 0; 
  font-family: 'Roboto', sans-serif; 
}

#app {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.background-image {
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100vw; 
  height: 100vh; 
  background-image: url('~@/assets/ferramentas_login.webp'); 
  background-size: cover; 
  z-index: -1; 
  filter: blur(2px); 
}

.carousel-enter-active, .carousel-leave-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out; 
}

.carousel-enter, .carousel-leave-to {
  transform: translateX(100%); 
  opacity: 0; 
}

.carousel-leave {
  transform: translateX(0); 
  opacity: 1; 
}
</style>
