import React, { useState, useEffect } from 'react'
import './Register.css'

function Register({ onRegister, onBack }) {
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({
    email: '',
    age: '',
    password: '',
    confirmPassword: ''
  })
  const [showInfoModal, setShowInfoModal] = useState(false)

  // Validation rules
  const validateForm = () => {
    let valid = true
    const newErrors = { email: '', age: '', password: '', confirmPassword: '' }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Ingresa un usuario válido'
      valid = false
    }

    // Age check (8 to 23 years)
    const numericAge = parseInt(age.replace(/\D/g, ''), 10)
    if (isNaN(numericAge) || numericAge < 8 || numericAge > 23) {
      newErrors.age = 'Ingresa una edad válida'
      valid = false
    }

    // Password length check
    if (!password || password.length < 8) {
      newErrors.password = 'Ingresa una contraseña válida'
      valid = false
    }

    // Password matching check
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Derive name from email
      const parts = email.split('@')[0].split(/[._-]/)
      const derivedName = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
      
      onRegister({
        email: email,
        name: derivedName || 'Explorador',
        age: parseInt(age.replace(/\D/g, ''), 10)
      })
    }
  }

  return (
    <div className="register-wrapper animate-fade-in">
      {/* Back to login link */}
      <button className="register-back-btn" onClick={onBack}>
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

      <div className="register-card">
        {/* Left Side: Form */}
        <div className="register-form-section">
          <h2 className="register-title">REGISTRATE</h2>
          <p className="register-subtitle">Estás registrándote</p>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="input-group">
              <label>Nombre / correo</label>
              <div className={`input-field-wrapper ${errors.email ? 'has-error' : ''}`}>
                <span className="input-icon">@</span>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucuenta@gmail.com"
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label>Edad</label>
              <div className={`input-field-wrapper ${errors.age ? 'has-error' : ''}`}>
                <span className="input-icon">🎂</span>
                <input 
                  type="text" 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="8 a 23 años"
                />
              </div>
              {errors.age && <span className="error-message">{errors.age}</span>}
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <div className={`input-field-wrapper ${errors.password ? 'has-error' : ''}`}>
                <span className="input-icon">🔒</span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="........"
                />
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="input-group">
              <label>Confirmar Contraseña</label>
              <div className={`input-field-wrapper ${errors.confirmPassword ? 'has-error' : ''}`}>
                <span className="input-icon">🔒</span>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="........"
                />
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="register-submit-btn">
              <span>Finalizar</span>
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
        </div>

        {/* Right Side: Bear and Choose Rank info */}
        <div className="register-bear-section">
          <div className="rank-header-wrapper">
            <h3 className="rank-title">ELIGE TU RANGO</h3>
            <button 
              type="button" 
              className="rank-info-btn"
              onClick={() => setShowInfoModal(true)}
              aria-label="Información de rangos"
            >
              ⓘ
            </button>
          </div>

          <div className="register-bear-container">
            <img 
              src="/assets/osito (2)-Photoroom.png" 
              alt="Oso Explorador" 
              className="register-bear-img animate-bounce-slow"
            />
          </div>
        </div>

        {/* Info Ranks Modal */}
        {showInfoModal && (
          <div className="rank-modal-overlay" onClick={() => setShowInfoModal(false)}>
            <div className="rank-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="rank-modal-title">¿Qué significan los rangos?</h3>
              
              <div className="rank-rows">
                <div className="rank-row">
                  <div className="rank-badge-wrapper">
                    <img src="/assets/8-11age.png" alt="Explorador Curioso" className="rank-badge-img" />
                  </div>
                  <div className="rank-text-content">
                    <h4 className="rank-row-title">Explorador Curioso (8 a 11 años)</h4>
                    <p>Es el inicio de tu viaje. Aquí comienzas a descubrir el mundo de la ciencia, la naturaleza y la tecnología de forma divertida. Aprendes jugando, experimentando y haciendo tus primeras creaciones con ayuda de T.U.M.</p>
                  </div>
                </div>

                <div className="rank-row">
                  <div className="rank-badge-wrapper">
                    <img src="/assets/12-15age.png" alt="Aprendiz STEM" className="rank-badge-img" />
                  </div>
                  <div className="rank-text-content">
                    <h4 className="rank-row-title">Aprendiz STEM (12 a 15 años)</h4>
                    <p>Ya tienes más curiosidad y ganas de entender cómo funcionan las cosas. En este rango exploras robótica, programación y pequeños proyectos científicos. T.U.M. te guía para que aprendas a resolver problemas y a pensar como un inventor.</p>
                  </div>
                </div>

                <div className="rank-row">
                  <div className="rank-badge-wrapper">
                    <img src="/assets/16-19age.png" alt="Joven Innovador" className="rank-badge-img" />
                  </div>
                  <div className="rank-text-content">
                    <h4 className="rank-row-title">Joven Innovador (16 a 19 años)</h4>
                    <p>Es tu momento de crear. Aquí desarrollas tus propias ideas, proyectos y soluciones. Aprendes a trabajar en equipo, a usar herramientas más avanzadas y a convertir tus ideas en algo real. T.U.M. se convierte en tu compañero de innovación.</p>
                  </div>
                </div>

                <div className="rank-row">
                  <div className="rank-badge-wrapper">
                    <img src="/assets/20-23age.png" alt="Mente Creativa" className="rank-badge-img" />
                  </div>
                  <div className="rank-text-content">
                    <h4 className="rank-row-title">Mente Creativa (20 a 23 años)</h4>
                    <p>Ya tienes experiencia y puedes compartirla con otros. En este rango te conviertes en guía y ejemplo para los más jóvenes. Diseñas proyectos más complejos, enseñas lo que sabes y ayudas a que otros también descubran su potencial junto a T.U.M.</p>
                  </div>
                </div>
              </div>

              <div className="rank-modal-footer">
                Haz clic en cualquier parte para cerrar
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Register
