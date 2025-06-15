import axios from 'axios';

const API = axios.create({
  baseURL: 'https://software-engineering-project-production-4aff.up.railway.app/api',
});

// Log every request URL and method
API.interceptors.request.use((config) => {
  console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
}, (error) => {
  console.error('[API REQUEST ERROR]', error);
  return Promise.reject(error);
});

// Log every response and error
API.interceptors.response.use((response) => {
  console.log('[API RESPONSE]', response);
  return response;
}, (error) => {
  console.error('[API ERROR]', error);
  return Promise.reject(error);
});

// Automatically attach token to requests
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};


// ADMIN USER ROUTES

export const getAllUsers = () => API.get('/users/all');
export const deleteUser = (id) => API.delete(`/users/${id}`);

// ADMIN RECIPE ROUTES

export const getRecipesByStatus = (status) => API.get(`/recipes/filter/status?status=${status}`);
export const approveRecipe = (id) => API.put(`/recipes/${id}/approve`);
export const rejectRecipe = (id) => API.put(`/recipes/${id}/reject`);


// AUTH ROUTES

export const registerUser = (data) => API.post('/users/register', data);
export const loginUser = (data) => API.post('/users/login', data);
export const getUserProfile = (id) => API.get(`/users/${id}`);
export const updateUserProfile = (id, data) => API.put(`/users/${id}`, data);
export const deleteUserProfile = (id) => API.delete(`/users/${id}`);
export const updateUserPassword = (id, data) => API.put(`/users/${id}/password`, data);

// RECIPE ROUTES

export const getAllRecipes = () => API.get('/recipes');
export const getRecipeById = (id) => API.get(`/recipes/${id}`);
export const createRecipe = (data) => API.post('/recipes', data);
export const updateRecipe = (id, data) => API.put(`/recipes/${id}`, data);
export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);



// REVIEW ROUTES

export const getReviews = (recipeId) => API.get(`/reviews/${recipeId}`);
export const addReview = (recipeId, data) => API.post(`/reviews/${recipeId}`, data);
export const updateReview = (recipeId, data) => API.put(`/reviews/${recipeId}`, data);
export const deleteReview = (reviewId) => API.delete(`/reviews/${reviewId}`);
export const getAverageRating = (recipeId) => API.get(`/reviews/${recipeId}/average`);

// FAVORITE ROUTES

export const getFavorites = () => API.get('/favorites');
export const addFavorite = (recipeId) => API.post(`/favorites/${recipeId}`);
export const removeFavorite = (recipeId) => API.delete(`/favorites/${recipeId}`);
export const isFavorite = (recipeId) => API.get(`/favorites/${recipeId}/check`);