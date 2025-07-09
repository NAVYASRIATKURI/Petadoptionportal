import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // This already includes 'api'
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      delete api.defaults.headers.common['Authorization'];
      // Redirect to login page
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// User related API calls
export const userAPI = {
  signup: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Pet related API calls
export const petAPI = {
  getAllPets: () => api.get('/pets'),
  createPet: (petData) => {
    // Ensure all required fields are present
    const formattedData = {
      ...petData,
      species: petData.species || '',
      age: petData.age || '',
      gender: petData.gender || '',
      size: petData.size || '',
      status: 'Available' // Set default status
    };
    return api.post('/pets', formattedData);
  },
  getPetById: (id) => api.get(`/pets/${id}`)
};

// Adoption related API calls
export const adoptionAPI = {
  getAllAdoptions: () => api.get('/adoptions'),
  createAdoption: (adoptionData) => api.post('/adoptions', adoptionData),
  updateAdoptionStatus: (id, status) => api.put(`/adoptions/${id}`, { status }),
};

// Community related API calls
export const communityAPI = {
  getAllPosts: () => api.get('/community'),
  createPost: (postData) => api.post('/community', postData),
  getPostById: (id) => api.get(`/community/${id}`),
  likePost: (postId) => api.post(`/community/${postId}/like`),
  unlikePost: (postId) => api.delete(`/community/${postId}/like`),
  addPawReaction: (postId, reactionType) => api.post(`/community/${postId}/reaction`, { type: reactionType }),
  addComment: (id, comment) => api.post(`/community/${id}/comments`, { comment })
};

export const lostFoundAPI = {
  getAllReports: () => api.get('/lost-found'),  // Remove extra 'api'
  createReport: (reportData) => api.post('/lost-found', reportData),
  updateReport: (id, status) => api.put(`/lost-found/${id}`, { status })
};

export default api;