import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Home from './pages/Home';
import About from './pages/About';
import Recipes from './pages/Recipes';
import RecipeDetails from './pages/RecipeDetails';
import AdminRoute from './components/Auth/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import AddRecipe from './pages/AddRecipe';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="recipes/:id" element={<RecipeDetails />} />
            <Route path="profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="admin" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            <Route path="add-recipe" element={
              <ProtectedRoute><AddRecipe /></ProtectedRoute>
            } />
            
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
