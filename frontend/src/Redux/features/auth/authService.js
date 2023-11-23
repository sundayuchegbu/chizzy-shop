import axios from 'axios';

const BACKEND_URL = 'http://localhost:1109';
export const API_URL = `${BACKEND_URL}/api/v1/auth/`;

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData, {
    withCredentials: true,
  });
  return response.data;
};
// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  return response.data;
};
// Logout user
const logout = async () => {
  const response = await axios.get(API_URL + 'logout');
  return response.data.message;
};
// Get login staus for user
const GetLoginStatus = async () => {
  const response = await axios.get(API_URL + 'status');
  return response.data;
};
// Get User
const getUser = async () => {
  const response = await axios.get(API_URL + 'user');
  return response.data;
};
// Update user profile
const updateUser = async (userData) => {
  const response = await axios.patch(API_URL + 'update', userData);
  return response.data;
};
// Update user photo
const updatePhoto = async (userData) => {
  const response = await axios.patch(API_URL + 'photo', userData);
  return response.data;
};
const authService = {
  register,
  login,
  logout,
  GetLoginStatus,
  getUser,
  updateUser,
  updatePhoto,
};
export default authService;
