import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './pages/login';
import { AuthProvider } from './context/AuthContext';
import { Register } from './pages/register';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import { PublicRoute } from './components/PublicRoutes';
import { ProtectedRoute } from './components/ProtectedRoutes';
import './App.css'

function App() {

  return (
    <div className="app-container">
      <BrowserRouter>
        <AuthProvider>
          <Routes>

            <Route element={<PublicRoute />} >
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
            </Route>

            <Route element={<ProtectedRoute />} >
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

//allowedRoles={["ROLE_EXPLORADOR", "ROLE_APRENDIZ_STEM", "ROLE_JOVEN_INNOVADOR", "ROLE_MENTOR_CREATIVO"]}



export default App
