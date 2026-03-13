import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PropertyDetails from './pages/PropertyDetails';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import MyProperties from './pages/MyProperties';
import Messages from './pages/Messages';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route 
          path="/add-property" 
          element={
            <ProtectedRoute>
              <AddProperty />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-property/:id" 
          element={
            <ProtectedRoute>
              <EditProperty />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-properties" 
          element={
            <ProtectedRoute>
              <MyProperties />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;