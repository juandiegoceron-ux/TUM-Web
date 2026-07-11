import React, { useState } from 'react'
import './Login.css'

function Login({ onLogin, onBack, onRegisterNav }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simple mock name derivation from email
    let derivedName = ''
    if (email) {
      const parts = email.split('@')[0].split(/[._-]/)
      derivedName = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
    }
    
    onLogin({
      email: email,
      name: derivedName || 'Explorador'
    })
  }

  const handleGoogleLogin = () => {
    onLogin({
      email: 'juan_diego.ceron@uao.edu.co',
      name: 'Juan Diego Ceron'
    })
  }

  return (
    <div className="login-wrapper animate-fade-in">
      {/* Back to welcome link */}
      <button className="login-back-btn" onClick={onBack}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Volver</span>
      </button>

      <div className="login-card">
        {/* Left: Peeking Bear Illustration */}
        <div className="login-bear-section">
          <img 
            src="/assets/osito1.png" 
            alt="Oso Andino Asomado" 
            className="login-bear-img"
          />
        </div>

        {/* Right: Form */}
        <div className="login-form-section">
          <h2 className="login-title">INICIA SESIÓN</h2>
          <p className="login-subtitle">Tu cuenta define tu perfil de explorador</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Nombre / correo</label>
              <div className="input-field-wrapper">
                <span className="input-icon">@</span>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <div className="input-field-wrapper">
                <span className="input-icon">🔒</span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="........"
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-submit-btn">
              <span>Entrar</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>

          <p className="login-register-link">
            ¿No estás registrado? <span onClick={onRegisterNav} style={{ cursor: 'pointer' }}>Crea tu cuenta</span>
          </p>

          {/* Google login option */}
          <button className="login-google-btn" onClick={handleGoogleLogin}>
            <img src="/assets/google.png" alt="Google logo" className="google-icon" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
