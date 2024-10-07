<template>
  <div class="container mt-5">
    <div class="rounded-box">
      <div class="row align-items-center">
        <div class="col-auto">
          <label for="file-input" style="cursor: pointer;">
            <img :src="userImage" alt="User Image" class="rounded-circle user-photo" />
          </label>
          <input type="file" id="file-input" @change="handleImageUpload" accept="image/*" class="d-none" />
        </div>
        <div class="col d-flex justify-content-between align-items-center">
          <h1 class="welcome-message">Bem vindo, {{ username }}</h1>
          <button @click="logout" class="btn btn-danger btn-lg">Sair</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AppDashboard',
  props: {
    username: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    profileImage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      userImage: this.profileImage || require('@/assets/profile.png') // Usar a imagem de perfil passada ou a padrão
    };
  },
  methods: {
    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Image = e.target.result;
          this.userImage = base64Image; 

          // Atualizar no backend (MongoDB)
          try {
            const response = await axios.post('http://localhost:3000/updateProfileImage', {
              userId: this.userId,
              profileImage: base64Image
            });
            console.log('Imagem de perfil atualizada:', response.data.message);
          } catch (error) {
            console.error('Erro ao atualizar a imagem de perfil:', error);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    logout() {
      this.$emit('logout');
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: flex-start; 
  height: 100%;
}

.rounded-box {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 1000px; 
}

.user-photo {
  width: 100px;
  height: 100px;
  object-fit: cover;
  cursor: pointer;
}

.welcome-message {
  font-size: 24px;
  font-weight: bold;
  margin-right: 20px;
}

</style>
