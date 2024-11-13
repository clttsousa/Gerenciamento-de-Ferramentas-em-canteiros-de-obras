// axiosConfig.js
import axios from "axios";

// Configurar o Axios para incluir o token em cada requisição
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token enviado:", token); // Verifique se o token está presente
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
