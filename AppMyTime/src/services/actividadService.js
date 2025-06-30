import axios from 'axios';

export const getActividades = async () => {
  const res = await axios.get('/api/actividades');
  return res.data;
};

export const getActividadesUsuario = async (rut) => {
  const response = await axios.get(`http://localhost:4000/api/usuario_actividad?rut_usuario=${rut}`);;
  return response.data;
};