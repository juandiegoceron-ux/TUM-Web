import React from 'react'
import './Welcome.css'

function Welcome({ onStart }) {
  return (
    <div className="welcome-wrapper animate-fade-in">
      <div className="welcome-card">
        {/* Left Side: Sitting Bear Illustration */}
        <div className="welcome-bear-section">
          <img 
            src="/assets/osito (2)-Photoroom.png" 
            alt="Oso Andino Explorador" 
            className="welcome-bear-img animate-bounce-slow"
          />
        </div>
        
        {/* Right Side: Welcome message and button */}
        <div className="welcome-content-section">
          <div className="welcome-badge">
            Aprende jugando
          </div>
          
          <p className="welcome-subtitle">
            Explora junto al oso andino
          </p>
          
          <h1 className="welcome-title">
            T.U.M.
          </h1>
          
          <button className="welcome-btn" onClick={onStart}>
            <span>Comenzar</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="welcome-btn-arrow"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          
          <p className="welcome-footer">
            Para exploradores de 8 a 23 años
          </p>
        </div>
      </div>
    </div>
  )
}

export default Welcome
