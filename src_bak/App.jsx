import React, { useState } from 'react'
import Welcome from './components/Welcome'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'

function App() {
  const [page, setPage] = useState('welcome')
  const [user, setUser] = useState(null)

  return (
    <div className="app-container">
      {page === 'welcome' && (
        <Welcome onStart={() => setPage('login')} />
      )}
      {page === 'login' && (
        <Login 
          onLogin={(userData) => {
            setUser(userData);
            setPage('dashboard');
          }} 
          onBack={() => setPage('welcome')}
          onRegisterNav={() => setPage('register')}
        />
      )}
      {page === 'register' && (
        <Register 
          onRegister={(userData) => {
            setUser(userData);
            setPage('dashboard');
          }} 
          onBack={() => setPage('login')}
        />
      )}
      {page === 'dashboard' && (
        <Dashboard 
          user={user} 
          onLogout={() => {
            setUser(null);
            setPage('welcome');
          }} 
        />
      )}
    </div>
  )
}

export default App

