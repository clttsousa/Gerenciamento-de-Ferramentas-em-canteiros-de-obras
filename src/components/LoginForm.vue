<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow-lg" style="width: 400px; border-radius: 20px;">
      <div class="card-body">
        <h2 class="text-center mb-4">Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="username" class="form-label">Usuário ou Email</label>
            <input
              type="text"
              v-model="login"
              class="form-control"
              id="login"
              placeholder="Digite seu usuário ou email"
              required
              @focus="clearError"
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Senha</label>
            <input
              type="password"
              v-model="password"
              class="form-control"
              id="password"
              placeholder="Digite sua senha"
              required
              @focus="clearError"
            />
          </div>
          <button type="submit" class="btn btn-primary w-100">Entrar</button>
          <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
        </form>
        <div class="text-center mt-3">
          <p>Não tem uma conta? <a href="#" @click.prevent="switchToRegister">Cadastre-se</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginForm',
  data() {
    return {
      login: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:3000/api/login', {
          login: this.login,
          password: this.password,
        });

        if (response.data.success) {
          alert('Login realizado com sucesso!');
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao fazer login';
        console.error(error);
      }
    },
    switchToRegister() {
      this.$emit('switch-to-register');
    },
    clearError() {
      this.errorMessage = '';
    }
  }
};
</script>

<style scoped>

.card {
  width: 400px; 
  max-width: 90%; 
  margin: 0 auto; 
  padding: 2rem; 
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.8);
  transition: transform 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.card:hover {
  transform: translateY(-5px);
}

.btn-primary {
  background-color: #c44b00;
  border: none;
}

.btn-primary:hover {
  background-color: #9d3c00;
}

.form-label {
  font-weight: bold;
}

input.form-control {
  transition: border-color 0.3s;
}

input.form-control:focus {
  border-color: #4e73df;
  box-shadow: 0 0 5px rgba(78, 115, 223, 0.5);
}
</style>