<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow-lg" style="width: 400px; border-radius: 20px;">
      <div class="card-body">
        <h2 class="text-center mb-4">Cadastro</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label for="username" class="form-label">Usuário</label>
            <input
              type="text"
              v-model="username"
              class="form-control"
              id="username"
              placeholder="Digite seu usuário"
              required
              @focus="clearError"
            />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              v-model="email"
              class="form-control"
              id="email"
              placeholder="Digite seu email"
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
          <button type="submit" class="btn btn-primary w-100">Cadastrar</button>
          <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
        </form>
        <div class="text-center mt-3">
          <p>Já tem uma conta? <a href="#" @click.prevent="switchToLogin">Entre</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification'; 

export default {
  name: 'RegisterForm',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  setup() {
    const toast = useToast(); 
    return { toast }; 
  },
  methods: {
    clearError() {
      this.errorMessage = '';
    },
    async handleRegister() {
      try {
        const response = await axios.post('http://localhost:3000/api/register', {
          username: this.username,
          email: this.email,
          password: this.password,
        });

        if (response.status === 201) {
          // Emitir notificação de sucesso
          this.toast.success('Usuário cadastrado com sucesso!'); // Adicione esta linha
          this.switchToLogin();
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao registrar usuário';
        console.error(error);
      }
    },
    switchToLogin() {
      this.$emit('switch-to-login');
    },
  },
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
