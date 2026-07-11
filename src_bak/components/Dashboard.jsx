import React, { useState } from 'react'
import { 
  Home, 
  HelpCircle, 
  User, 
  Settings, 
  Battery, 
  Wifi, 
  Accessibility, 
  Lock, 
  LogOut,
  Sparkles,
  Smartphone,
  ShieldAlert,
  Compass,
  Smile,
  Eye,
  Activity,
  Heart,
  Trees,
  Scale,
  BookOpen
} from 'lucide-react'
import './Dashboard.css'

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('inicio')
  const [selectedCard, setSelectedCard] = useState(0)
  const [showGameModal, setShowGameModal] = useState(false)
  const [activeGameTitle, setActiveGameTitle] = useState('')

  // List of 16 cards matching Image 3 grid
  const gameCards = [
    { id: 0, title: 'El Comiezo', active: true, icon: Sparkles },
    { id: 1, title: 'Guía a T.U.M', active: true, icon: Compass },
    { id: 2, title: '¿Como me siento?', active: true, icon: Smile },
    { id: 3, title: '¿Que ves tú?', active: true, icon: Eye },
    { id: 4, title: 'El Oso en movimiento', active: true, icon: Activity },
    { id: 5, title: 'El sismógrafo del oso', active: true, icon: Heart },
    { id: 6, title: 'El senso del bosque', active: true, icon: Trees },
    { id: 7, title: 'Equilibrio en el Páramo', active: true, icon: Scale },
    { id: 8, title: 'Historias del bosque andino', active: true, icon: BookOpen },
    { id: 9, title: 'Encuentra la amenaza', active: true, icon: ShieldAlert },
    { id: 10, title: 'Próximamente', active: false, lock: true },
    { id: 11, title: 'Próximamente', active: false, lock: true },
    { id: 12, title: 'Próximamente', active: false, lock: true },
    { id: 13, title: 'Próximamente', active: false, lock: true },
    { id: 14, title: 'Próximamente', active: false, lock: true },
    { id: 15, title: 'Próximamente', active: false, lock: true },
  ]

  const handleCardClick = (card) => {
    if (!card.active) return
    setSelectedCard(card.id)
    setActiveGameTitle(card.title)
    setShowGameModal(true)
  }

  // Derived user initials
  const userInitial = user && user.name ? user.name.charAt(0).toUpperCase() : 'E'
  const userName = user && user.name ? user.name : 'Explorador'

  return (
    <div className="dashboard-wrapper animate-fade-in">
      <div className="dashboard-container">
        
        {/* Top Banner (Brown background) */}
        <div className="dashboard-banner">
          <div className="banner-left">
            <div className="user-avatar">{userInitial}</div>
            <div className="user-greeting">
              <span className="greeting-label">¡Hola, explorador!</span>
              <h3 className="greeting-name">Bienvenido, {userName}</h3>
            </div>
          </div>
          
          <div className="banner-right">
            {/* Battery Indicator */}
            <div className="status-item battery-status">
              <span className="status-label">Bateria</span>
              <div className="battery-bar-container">
                <div className="battery-bar-fill" style={{ width: '65%' }}></div>
              </div>
              <span className="status-value">65%</span>
            </div>

            {/* Sitting State Badge */}
            <div className="status-badge sitting-badge">
              <Accessibility size={16} className="badge-icon" />
              <span>Estado: Sentado</span>
            </div>

            {/* Connection Badge */}
            <div className="status-badge connection-badge">
              <Wifi size={16} className="badge-icon" />
              <span>T.U.M. conectado</span>
            </div>
          </div>
        </div>

        {/* Dynamic content based on Bottom Navigation active tab */}
        <div className="dashboard-main-content">
          
          {/* TAB: INICIO (GRID OF GAMES) */}
          {activeTab === 'inicio' && (
            <div className="game-grid">
              {gameCards.map((card) => {
                const CardIcon = card.icon || Lock
                const isSelected = card.id === selectedCard
                
                return (
                  <div 
                    key={card.id} 
                    className={`game-card ${card.active ? 'active-card' : 'locked-card'} ${isSelected ? 'selected-card' : ''}`}
                    onClick={() => handleCardClick(card)}
                  >
                    {!card.active ? (
                      <div className="locked-content">
                        <Lock className="lock-icon" size={32} />
                        <span className="locked-text">Próximamente</span>
                      </div>
                    ) : (
                      <div className="card-content">
                        <div className="card-icon-wrapper">
                          <CardIcon size={24} className="card-icon" />
                        </div>
                        <span className="card-title">{card.title}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* TAB: CONOCE A T.U.M. */}
          {activeTab === 'conoce' && (
            <div className="tab-pane-content animate-fade-in">
              <div className="info-section">
                <h2>¿Qué es T.U.M.?</h2>
                <p>
                  <strong>T.U.M. (Tecnología y Oso Andino en Movimiento)</strong> es una plataforma interactiva diseñada para explorar la biodiversidad de los Andes y aprender sobre la conservación del oso andino mediante minijuegos y actividades tecnológicas.
                </p>
                <div className="info-grid">
                  <div className="info-box">
                    <h3>🌲 Conservación</h3>
                    <p>Conoce las amenazas que enfrenta el oso de anteojos y cómo cuidar su hábitat natural como los páramos y bosques.</p>
                  </div>
                  <div className="info-box">
                    <h3>🎮 Aprendizaje Lúdico</h3>
                    <p>A través de simulaciones de equilibrio, movimiento y sismografía, entenderás los comportamientos físicos y biológicos de la naturaleza.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PERFIL */}
          {activeTab === 'perfil' && (
            <div className="tab-pane-content animate-fade-in">
              <div className="profile-section">
                <div className="profile-header">
                  <div className="profile-avatar-large">{userInitial}</div>
                  <h2>{userName}</h2>
                  <p>{user?.email}</p>
                </div>
                
                <div className="profile-stats">
                  <div className="stat-box">
                    <span className="stat-val">10</span>
                    <span className="stat-lbl">Juegos Desbloqueados</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-val">65%</span>
                    <span className="stat-lbl">Progreso General</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-val">Explorador</span>
                    <span className="stat-lbl">Rango actual</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AJUSTES */}
          {activeTab === 'ajustes' && (
            <div className="tab-pane-content animate-fade-in">
              <div className="settings-section">
                <h2>Ajustes de la Cuenta</h2>
                
                <div className="settings-options">
                  <div className="settings-option">
                    <div>
                      <h4>Efectos de Sonido</h4>
                      <p>Habilitar sonidos de botón y clicks</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="settings-option">
                    <div>
                      <h4>Música de Fondo</h4>
                      <p>Música ambiental relajante del bosque</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <button className="logout-btn" onClick={onLogout}>
                    <LogOut size={18} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Floating Navigation Bar */}
        <div className="dashboard-navigation">
          <button 
            className={`nav-btn ${activeTab === 'inicio' ? 'active-nav' : ''}`}
            onClick={() => setActiveTab('inicio')}
          >
            <Home size={18} />
            <span>Inicio</span>
          </button>

          <button 
            className={`nav-btn ${activeTab === 'conoce' ? 'active-nav' : ''}`}
            onClick={() => setActiveTab('conoce')}
          >
            <HelpCircle size={18} />
            <span>Conoce a T.U.M.</span>
          </button>

          <button 
            className={`nav-btn ${activeTab === 'perfil' ? 'active-nav' : ''}`}
            onClick={() => setActiveTab('perfil')}
          >
            <User size={18} />
            <span>Perfil</span>
          </button>

          <button 
            className={`nav-btn ${activeTab === 'ajustes' ? 'active-nav' : ''}`}
            onClick={() => setActiveTab('ajustes')}
          >
            <Settings size={18} />
            <span>Ajustes</span>
          </button>
        </div>

      </div>

      {/* Interactive Game Modal (Simulation of starting a game) */}
      {showGameModal && (
        <div className="game-modal-overlay animate-fade-in">
          <div className="game-modal">
            <div className="modal-header">
              <h3>🎮 Iniciando Minijuego</h3>
              <button className="close-modal-btn" onClick={() => setShowGameModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <h2>{activeGameTitle}</h2>
              <div className="loader-container">
                <div className="game-loader"></div>
                <p>Cargando el entorno del videojuego...</p>
              </div>
              <div className="game-mock-workspace">
                <span>[ Área del minijuego ejecutándose en canvas de React ]</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-play-btn" onClick={() => setShowGameModal(false)}>
                Comenzar Actividad
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard
