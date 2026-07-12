import { useState } from 'react';
import { RotateCcw, LogOut, Compass, Tablet, Camera, Eye } from 'lucide-react';
import '../styles/guia_tum.css';

interface GuiaTumGameProps {
    onClose: () => void;
}

type Difficulty = 'infantil' | 'adulto' | null;
type Submode = 'map' | 'tablet' | 'lidar' | 'observar';

export const GuiaTumGame = ({ onClose }: GuiaTumGameProps) => {
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(null);
    const [submode, setSubmode] = useState<Submode>('map');
    const [energy] = useState<number>(22); // Iniciado en 22% según la imagen de referencia
    
    return (
        <div className="gt-game-overlay animate-fade-in">
            <div className="gt-game-container">
                
                {/* Barra Superior */}
                <div className="gt-header">
                    <div className="gt-header-left">
                        <div className="gt-energy-pill">
                            <div className="gt-energy-title-row">
                                <div className="gt-energy-icon-label">
                                    <span>🔋</span>
                                    <span>Energía de T.U.M.</span>
                                </div>
                                <span>{energy}%</span>
                            </div>
                            <div className="gt-energy-bar">
                                <div className="gt-energy-fill" style={{ width: `${energy}%` }}></div>
                            </div>
                        </div>

                        <div className="gt-mission-pill">
                            <span className="gt-mission-label">MISIÓN 1 DE 3</span>
                            <span className="gt-mission-title">Conociendo a T.U.M.</span>
                        </div>
                    </div>

                    <div className="gt-header-center">
                        <button className="gt-circle-btn" onClick={() => setSelectedDifficulty(null)} aria-label="Repetir">
                            <RotateCcw size={22} />
                            <span>Repetir</span>
                        </button>
                        <button className="gt-circle-btn" onClick={onClose} aria-label="Salir">
                            <LogOut size={22} />
                            <span>Salir</span>
                        </button>
                    </div>

                    <div className="gt-header-right">
                        <div className="gt-status-pill">
                            <div className="gt-pill-icon-circle gt-purple-bg">🌲</div>
                            <span>0</span>
                        </div>
                        <div className="gt-status-pill">
                            <div className="gt-pill-icon-circle gt-yellow-bg">🌱</div>
                            <span>0</span>
                        </div>
                        <div className="gt-insignia-pill">
                            🎖️ Insignia
                        </div>
                        <div className="gt-compass-pill">
                            <Compass size={22} />
                        </div>
                    </div>
                </div>

                {/* Contenido Principal (Lobby) */}
                <div className="gt-main-lobby">
                    <div className="gt-lobby-card">
                        <span className="gt-lobby-subtitle">MJ #1 · GUÍA A T.U.M.</span>
                        <h2 className="gt-lobby-title">
                            {selectedDifficulty === null ? 'Elige tu dificultad' : `Modo ${selectedDifficulty === 'infantil' ? 'Infantil' : 'Adolescente / Adulto'} seleccionado`}
                        </h2>
                        <p className="gt-lobby-desc">
                            {selectedDifficulty === null 
                                ? 'T.U.M. se perdió en una zona nueva del Bosque Andino. Traza la mejor ruta para llevarlo a un lugar con comida, agua y árboles frondosos.'
                                : 'Preparando el entorno del minijuego para iniciar la actividad...'
                            }
                        </p>

                        {selectedDifficulty === null ? (
                            <div className="gt-lobby-modes">
                                <div className="gt-mode-card" onClick={() => setSelectedDifficulty('infantil')}>
                                    <span className="gt-mode-label">NIÑAS Y NIÑOS</span>
                                    <h3 className="gt-mode-title">Modo Infantil</h3>
                                    <ul className="gt-mode-bullets">
                                        <li><span className="gt-bullet-dot"></span>Define una ruta libre</li>
                                        <li><span className="gt-bullet-dot"></span>Sin límite de tiempo</li>
                                        <li><span className="gt-bullet-dot"></span>Energía generosa</li>
                                    </ul>
                                </div>

                                <div className="gt-mode-card" onClick={() => setSelectedDifficulty('adulto')}>
                                    <span className="gt-mode-label">RETO DE EFICIENCIA</span>
                                    <h3 className="gt-mode-title">Modo Adolescente / Adulto</h3>
                                    <ul className="gt-mode-bullets">
                                        <li><span className="gt-bullet-dot"></span>Busca la ruta más corta</li>
                                        <li><span className="gt-bullet-dot"></span>Tiempo límite activo</li>
                                        <li><span className="gt-bullet-dot"></span>Anticipa los riesgos</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <button className="gt-result-btn" onClick={() => setSelectedDifficulty(null)}>
                                Volver a elegir
                            </button>
                        )}
                    </div>
                </div>

                {/* Acciones Inferiores */}
                <div className="gt-footer-actions">
                    <div className="gt-action-btn-container">
                        <button 
                            className={`gt-circle-action-btn ${submode === 'tablet' ? 'active' : ''}`}
                            onClick={() => setSubmode('tablet')}
                            aria-label="Tablet"
                        >
                            <Tablet size={24} />
                        </button>
                        <span className="gt-action-label">Tablet</span>
                    </div>

                    <div className="gt-action-btn-container">
                        <button 
                            className={`gt-circle-action-btn ${submode === 'lidar' ? 'active' : ''}`}
                            onClick={() => setSubmode('lidar')}
                            aria-label="LIDAR"
                        >
                            <Camera size={24} />
                        </button>
                        <span className="gt-action-label">Cámara / LIDAR</span>
                    </div>

                    <div className="gt-action-btn-container">
                        <button 
                            className={`gt-circle-action-btn ${submode === 'observar' ? 'active' : ''}`}
                            onClick={() => setSubmode('observar')}
                            aria-label="Observar"
                        >
                            <Eye size={24} />
                        </button>
                        <span className="gt-action-label">Observar</span>
                    </div>
                </div>

            </div>
        </div>
    );
};
