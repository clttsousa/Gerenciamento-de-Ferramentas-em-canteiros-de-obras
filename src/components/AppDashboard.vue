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
          <h1 class="welcome-message">Bem vindo ao seu gerenciador de ferramentas, abaixo está seu depósito e obras.
          </h1>
          <button @click="logout" class="btn btn-danger btn-lg">Sair</button>
        </div>
      </div>
    </div>

    <!-- Botões do Depósito e Obras -->
    <div class="button-container modal-lg">
      <button class="btn-deposito" @click="openDeposit">
        <img :src="require('@/assets/storage.png')" alt="Abrir Depósito" class="deposito-image" />
        <span class="deposito-text">Abrir Depósito</span>
      </button>
      <button class="btn-obra" @click="openAddObraModal">
        <img :src="require('@/assets/add.png')" alt="Adicionar Obra" class="obra-image" />
        <span class="obra-text">Adicionar Obra</span>
      </button>
      <button class="btn-obra" @click="openObrasModal">
        <img :src="require('@/assets/work.png')" alt="Obras" class="obra-image" />
        <span class="obra-text">Obras</span>
      </button>
    </div>
  </div>

  <!-- Modal do Depósito -->
  <div v-if="showDeposit" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Depósito de Ferramentas</h5>
          <button @click="closeDeposit" type="button" class="close" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Quantidade</th> <!-- Coluna para exibir a quantidade -->
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tool in tools" :key="tool._id">
                <td>{{ tool.name }}</td>
                <td class="tool-description">{{ tool.description }}</td>
                <td>{{ tool.quantity }}</td> <!-- Exibindo a quantidade da ferramenta -->
                <td>
                  <button @click="editTool(tool)" class="btn btn-warning">Editar</button>
                  <button @click="showDeleteConfirmation(tool._id)" class="btn btn-danger">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button @click="openAddToolModal" class="btn btn-success">Adicionar Ferramenta</button>
          <button @click="closeDeposit" class="btn btn-secondary">Fechar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para Adicionar/Editar Ferramenta -->
  <div v-if="showAddToolModal && !showDeposit && !showDeleteConfirmationModal" class="modal fade show" tabindex="-1"
    role="dialog" style="display: block;">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditing ? 'Editar Ferramenta' : 'Adicionar Ferramenta' }}</h5>
          <button @click="closeAddToolModal" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="isEditing ? updateTool() : addTool()">
            <div class="form-group">
              <label for="toolName">Nome</label>
              <input type="text" v-model="newTool.name" class="form-control" required />
            </div>
            <div class="form-group">
              <label for="toolDescription">Descrição</label>
              <textarea v-model="newTool.description" class="form-control" rows="4" required></textarea>
            </div>
            <div class="form-group">
              <label for="quantity">Quantidade</label>
              <input type="number" v-model="newTool.quantity" class="form-control" min="1" required />
            </div>
            <button type="submit" class="btn btn-success">{{ isEditing ? 'Atualizar' : 'Adicionar' }}</button>
          </form>
          <div v-if="successMessage" class="alert alert-success mt-2">
            Ferramenta adicionada com sucesso!
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeAddToolModal" class="btn btn-secondary">Fechar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Confirmação de Exclusão -->
  <div v-if="showDeleteConfirmationModal && !showDeposit && !showAddToolModal" class="modal fade show" tabindex="-1"
    role="dialog" style="display: block;">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirmar Exclusão</h5>
          <button @click="closeDeleteConfirmationModal" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Tem certeza de que deseja excluir esta ferramenta?</p>
          <div class="form-group">
            <label for="quantityToDelete">Quantidade a excluir:</label>
            <input type="number" id="quantityToDelete" v-model="quantityToDelete" class="form-control" min="1"
              required />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="deleteTool(toDeleteToolId)" class="btn btn-danger">Sim, Excluir</button>
          <button @click="closeDeleteConfirmationModal" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para Gerenciar Obras -->
  <div v-if="showObrasModal" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Obras</h5>
          <button @click="closeObrasModal" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <!-- Lista de Obras e Botões de Ação -->
          <ul class="list-group">
            <li v-for="obra in obras" :key="obra._id"
              class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{{ obra.name }}</strong> - {{ obra.address }}
              </div>
              <div>
                <button @click="enterObra(obra)" class="btn btn-primary btn-sm">Entrar</button>
                <button @click="editObra(obra)" class="btn btn-secondary btn-sm">Editar</button>
                <button @click="deleteObra(obra._id)" class="btn btn-danger btn-sm">Excluir</button>
              </div>
            </li>
          </ul>
        </div>
        <div class="modal-footer">
          <button @click="closeObrasModal" class="btn btn-secondary">Fechar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para exibir ferramentas da obra ou depósito -->
  <div v-if="showObraToolsModal" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Ferramentas de {{ selectedObra ? selectedObra.name : 'Depósito' }}</h5>
          <button @click="closeObraToolsModal" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <!-- Tabela para listar ferramentas -->
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Quantidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tool in obraTools" :key="tool._id">
                <td>{{ tool.name }}</td>
                <td>{{ tool.quantity }}</td>
                <td>
                  <!-- Botão para remover a ferramenta -->
                  <button @click="removeToolFromObra(tool._id)" class="btn btn-danger btn-sm">Remover</button>

                  <!-- Botão para enviar a ferramenta para outra obra ou depósito -->
                  <button @click="openSendToolModal(tool)" class="btn btn-secondary btn-sm">Enviar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <!-- Botão para adicionar uma nova ferramenta -->
          <button @click="openAddToolToObraModal" class="btn btn-primary">Adicionar Ferramenta</button>
          <button @click="closeObraToolsModal" class="btn btn-secondary">Fechar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para enviar a ferramenta para outra obra ou depósito -->
  <div v-if="showSendToolModal" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Enviar Ferramenta</h5>
          <button @click="closeSendToolModal" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Escolha para onde enviar a ferramenta:</p>
          <select v-model="selectedDestination" class="form-control" @change="setDestinationType">
            <option value="deposito">Depósito</option>
            <option v-for="obra in obrasList" :key="obra._id" :value="obra._id">
              {{ obra.name }}
            </option>
          </select>

          <div class="mt-3">
            <label for="quantity">Quantidade</label>
            <input type="number" v-model="selectedQuantity" min="1" :max="selectedToolQuantity" class="form-control" />
            <small>Máximo disponível: {{ selectedToolQuantity }}</small>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="sendToolToDestination" class="btn btn-success">Enviar</button>
          <button @click="closeSendToolModal" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para adicionar uma nova ferramenta à obra -->
  <div v-if="showAddToolToObraModal" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Adicionar Ferramenta à Obra</h5>
          <button @click="closeAddToolToObraModal" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addToolToObra">
            <div class="form-group">
              <input v-model="newTool.name" placeholder="Nome da ferramenta" class="form-control" required />
            </div>
            <div class="form-group">
              <input v-model="newTool.description" placeholder="Descrição" class="form-control" />
            </div>
            <div class="form-group">
              <input type="number" v-model.number="newTool.quantity" placeholder="Quantidade" min="1"
                class="form-control" required />
            </div>
            <button type="submit" class="btn btn-success">Adicionar Ferramenta</button>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeAddToolToObraModal" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para Adicionar Obra -->
  <div v-if="showAddObraModal" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Adicionar Obra</h5>
          <button @click="closeAddObraModal" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addObra">
            <div class="form-group">
              <label for="obraName">Nome da Obra</label>
              <input type="text" v-model="newObra.name" class="form-control" required />
            </div>
            <div class="form-group">
              <label for="obraAddress">Endereço</label>
              <input type="text" v-model="newObra.address" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-success">Adicionar Obra</button>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeAddObraModal" class="btn btn-secondary">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  name: 'AppDashboard',
  emits: ['logout'],
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
      userImage: this.profileImage || require('@/assets/profile.png'),
      showDeposit: false,
      showAddObraModal: false,
      showObrasModal: false,
      showAddToolToObraModal: false,
      newObra: {
        name: '',
        address: ''
      },
      obras: [],
      isEditingObra: false,
      editingObraId: null,
      showObraToolsModal: false,
      selectedObra: null,
      obraTools: [],
      showAddToolModal: false,
      showDeleteConfirmationModal: false,
      newTool: {
        name: '',
        description: '',
        quantity: 1
      },
      tools: [],
      selectedDestination: '',
      selectedDestinationType: '',
      obrasList: [],
      selectedToolId: '',
      showSendToolModal: false,
      isEditing: false,
      editingToolId: null,
      toDeleteToolId: null,
      toast: null
    };
  },

  mounted() {
    this.fetchTools();
    this.fetchObras();
    this.toast = useToast();
  },

  methods: {
    logout() {
      this.$emit('logout');
    },
    openDeposit() {
      this.closeAllModals();
      this.showDeposit = true;
    },
    closeDeposit() {
      this.showDeposit = false;
    },
    openAddObraModal() {
      this.closeAllModals();
      this.showAddObraModal = true;
    },
    openSendToolModal(tool) {
      this.selectedToolId = tool._id;
      this.showSendToolModal = true;
      this.selectedDestination = null;
    },

    closeSendToolModal() {
      this.showSendToolModal = false;  // Esconde o modal de envio
      this.selectedToolId = null;      // Limpa o ID da ferramenta selecionada
      this.selectedDestination = null; // Limpa a seleção do destino
    },

    setDestinationType() {
      // Verifica se o destino selecionado é 'deposito' ou uma obra
      if (this.selectedDestination === 'deposito') {
        this.selectedDestinationType = 'deposito';  // Define como depósito
      } else {
        this.selectedDestinationType = 'obra';  // Tipo de obra
      }
    },
    async sendToolToDestination() {
      if (!this.selectedDestination || !this.selectedDestinationType || !this.selectedQuantity) {
        alert("Por favor, preencha todos os campos.");
        return;
      }

      const payload = {
        toolId: this.selectedToolId,
        destinationId: this.selectedDestination === 'deposito' ? 'deposito' : this.selectedDestination,
        destinationType: this.selectedDestinationType,
        quantity: this.selectedQuantity
      };

      try {
        const response = await axios.post('http://localhost:3000/api/works/move-tool', payload);
        console.log(response.data.message);

        // Atualize as ferramentas no frontend após o movimento
        await this.fetchTools();  // Supondo que você tenha um método fetchTools para recarregar as ferramentas

        this.closeSendToolModal();
      } catch (error) {
        console.error("Erro ao mover a ferramenta:", error);
        alert('Erro ao mover a ferramenta');
      }
    },

    closeAddObraModal() {
      this.showAddObraModal = false;
      this.newObra = { name: '', address: '' };
    },
    openObrasModal() {
      this.closeAllModals();
      this.showObrasModal = true;
      this.fetchObras(); // Chama fetchObras ao abrir o modal
    },
    closeObrasModal() {
      this.showObrasModal = false;
    },
    openAddToolModal() {
      this.closeAllModals();
      this.showAddToolModal = true;
      this.isEditing = false;
      this.newTool = { name: '', description: '' };
    },
    closeAddToolModal() {
      this.showAddToolModal = false;
    },
    showDeleteConfirmation(toolId) {
      this.closeAllModals();
      this.toDeleteToolId = toolId;
      this.showDeleteConfirmationModal = true;
    },
    closeDeleteConfirmationModal() {
      this.showDeleteConfirmationModal = false;
    },
    closeAllModals() {
      this.showDeposit = false;
      this.showAddToolModal = false;
      this.showDeleteConfirmationModal = false;
      this.showObraToolsModal = false;
      this.showAddToolToObraModal = false;
      this.showObrasModal = false; // Certifique-se de fechar o modal de obras
    },
    async fetchObras() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/works/obras', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Resposta da API para obras:", response.data); // Log para verificar a resposta
        this.obras = response.data;
      } catch (error) {
        console.error("Erro ao buscar obras:", error);
      }
    },
    async enterObra(obra) {
      this.closeAllModals();
      this.selectedObra = obra;
      await this.fetchToolsFromObra(obra._id); // Carrega as ferramentas da obra
      this.showObraToolsModal = true;
    },
    openAddToolToObraModal() {
      this.showAddToolToObraModal = true;
      this.newTool = {};
    },
    closeAddToolToObraModal() {
      this.showAddToolToObraModal = false;
    },
    closeObraToolsModal() {
      this.showObraToolsModal = false;
      this.selectedObra = null;
      this.obraTools = [];
    },

    async fetchToolsFromObra() {
      const obraId = this.selectedObra._id;
      try {
        const response = await axios.get(`http://localhost:3000/api/works/obras/${obraId}/tools`);
        this.obraTools = response.data; // Atualiza a lista de ferramentas para as ferramentas da obra
        console.log(`Ferramentas na obra ${this.selectedObra._id} carregadas:`, this.obraTools);
      } catch (error) {
        console.error("Erro ao buscar ferramentas da obra:", error);
      }
    },
    async addToolToObra() {
      const obraId = this.selectedObra._id;

      const toolData = {
        name: this.newTool.name,
        description: this.newTool.description,
        quantity: this.newTool.quantity
      };

      try {
        const response = await axios.post(`http://localhost:3000/api/works/obras/${obraId}/tools`, toolData);
        this.obraTools.push(response.data);
        this.toast.success('Ferramenta adicionada à obra com sucesso!');
        this.closeAddToolToObraModal();
        await this.fetchToolsFromObra();
        console.log(`Ferramentas na obra ${this.selectedObra._id} carregadas:`, this.obraTools);

      } catch (error) {
        console.error("Erro ao adicionar ferramenta à obra:", error);
      }
    },
    async removeToolFromObra(toolId) {
      try {
        await axios.delete(`http://localhost:3000/api/works/obras/${this.selectedObra._id}/tools/${toolId}`);
        this.obraTools = this.obraTools.filter(tool => tool._id !== toolId);
        this.toast.success('Ferramenta removida da obra com sucesso!');
      } catch (error) {
        console.error("Erro ao remover ferramenta da obra:", error);
      }
    },
    addObra() {
      console.log("Tentando adicionar obra:", this.newObra);

      const obraData = {
        name: this.newObra.name,
        address: this.newObra.address,
      };

      const token = localStorage.getItem('token');
      return axios.post(`http://localhost:3000/api/works/obras`, obraData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => {
          console.log("Nova obra adicionada:", obraData);
          this.closeAddObraModal();
          this.toast.success('Obra adicionada com sucesso!');
          this.fetchObras();
        })
        .catch((error) => {
          console.error("Erro ao adicionar obra:", error);
        });
    },
    editObra(obra) {
      this.isEditingObra = true;
      this.editingObraId = obra._id;
      this.newObra = { name: obra.name, address: obra.address };
      this.showAddObraModal = true;
    },
    updateObra() {
      const obraData = {
        name: this.newObra.name,
        address: this.newObra.address,
      };

      axios.put(`http://localhost:3000/api/works/obras/${this.editingObraId}`, obraData)
        .then(() => {
          this.toast.success('Obra atualizada com sucesso!');
          this.closeAddObraModal();
          this.fetchObras();
        })
        .catch((error) => {
          console.error("Erro ao atualizar obra:", error);
        });
    },
    deleteObra(obraId) {
      axios.delete(`http://localhost:3000/api/works/obras/${obraId}`)
        .then(() => {
          this.toast.success('Obra excluída com sucesso!');
          this.fetchObras();
        })
        .catch((error) => {
          console.error("Erro ao excluir obra:", error);
        });
    },
    async fetchTools() {
      if (!this.userId) {
        console.error('userId is undefined');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${this.userId}/tools`);
        this.tools = response.data;
        console.log('Ferramentas carregadas:', this.tools);
      } catch (error) {
        console.error("Erro ao buscar ferramentas:", error);
      }
    },
    addTool() {
      const toolData = {
        name: this.newTool.name,
        description: this.newTool.description,
        quantity: this.newTool.quantity
      };
      axios.post(`http://localhost:3000/api/users/${this.userId}/tools`, toolData)
        .then(response => {
          this.tools.push(response.data);
          this.toast.success('Ferramenta adicionada com sucesso!');
          this.closeAddToolModal();
          this.fetchTools();
        })
        .catch(error => {
          console.error("Erro ao adicionar ferramenta:", error);
        });
    },
    editTool(tool) {
      this.newTool = { ...tool };
      this.isEditing = true;
      this.editingToolId = tool._id;
      this.showAddToolModal = true;
    },
    updateTool() {
      axios.put(`http://localhost:3000/api/users/${this.userId}/tools/${this.editingToolId}`, this.newTool)
        .then(() => {
          const index = this.tools.findIndex(tool => tool._id === this.editingToolId);
          this.$set(this.tools, index, { ...this.newTool });
          this.toast.success('Ferramenta atualizada com sucesso!');
          this.closeAddToolModal();
        })
        .catch(error => {
          console.error("Erro ao atualizar ferramenta:", error);
        });
    },
    deleteTool(toolId) {
      const quantityToDelete = this.quantityToDelete || 1; // Usar a quantidade especificada ou 1
      console.log('Tentando excluir a ferramenta com ID:', toolId, 'Quantidade:', quantityToDelete);
      axios.delete(`http://localhost:3000/api/users/${this.userId}/tools/${toolId}?quantity=${quantityToDelete}`)
        .then(response => {
          console.log('Resposta do servidor:', response); // Verifique a resposta
          this.tools = this.tools.filter(tool => tool._id !== toolId);
          this.toast.success('Ferramenta excluída com sucesso!');
          this.quantityToDelete = null; // Limpe a quantidade após a exclusão
          this.closeDeleteConfirmationModal();
        })
        .catch(error => {
          console.error("Erro ao excluir ferramenta:", error);
        });
    },
  }
};
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.button-container {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-top: 20px;
  justify-content: flex-start;
}

.rounded-box {
  background-color: rgba(255, 254, 254, 0.7);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 1000px;
  max-width: 1300px;
}

.user-photo {
  width: 100px;
  height: 100px;
}

.welcome-message {
  font-size: 20px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #000000;
}

.btn-deposito,
.btn-obra {
  position: relative;
  background: linear-gradient(135deg, #fdfdfd, #915500);
  color: white;
  padding: 15px;
  border: none;
  border-radius: 10px;
  width: 220px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn-deposito:hover,
.btn-obra:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.7);
  background: linear-gradient(135deg, #ffb54e, #b98337);
}

.deposito-image {
  width: 200px;
  height: auto;
  border-radius: 15px;
  margin-bottom: 10px;
  background-color: rgba(255, 254, 254, 0.7);
}

.obra-image {
  width: 200px;
  height: auto;
  border-radius: 15px;
  margin-bottom: 10px;
  background-color: rgba(255, 254, 254, 0.7);
}

.deposito-text-bg {
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  padding: 5px;
  margin-top: 5px;
  text-align: center;
}

.deposito-text-bg:hover {
  background-color: rgba(0, 0, 0, 1);
}

.deposito-text,
.obra-text {
  color: rgb(0, 0, 0);
  font-size: 18px;
  display: block;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.modal {
  background-color: rgba(0, 0, 0, 0.7);
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 0;
  transform: translateY(-30px);
}

.modal.show {
  opacity: 1;
  transform: translateY(0);
}

.modal-content {
  max-width: 80%;
  /* Ajuste a largura máxima do modal */
  margin: auto;
  /* Centraliza o modal */
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 800px;
  max-width: 90%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #915500;
  color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
  background-color: #f8f9fa;
  padding: 20px;
}

.tool-description {
  white-space: normal;
  max-height: 100px;
  overflow: hidden;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  background-color: #f1f1f1;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  border-radius: 15px 15px 0 0;
  object-fit: cover;
  height: 200px;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
