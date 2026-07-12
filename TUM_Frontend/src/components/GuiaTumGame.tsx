import { useState, useCallback, useEffect } from 'react';
import { RotateCcw, LogOut, Compass, Tablet, Camera, Eye, Shield, Zap, RefreshCw, Play } from 'lucide-react';
import '../styles/guia_tum.css';

interface GuiaTumGameProps {
    onClose: () => void;
}

interface Position {
    x: number;
    y: number;
}

type Submode = 'tablet' | 'lidar' | 'observar' | null;

export const GuiaTumGame = ({ onClose }: GuiaTumGameProps) => {
    const [path, setPath] = useState<Position[]>([{ x: 0, y: 0 }]);
    const [selectedPowerups, setSelectedPowerups] = useState<string[]>([]);
    const [submode, setSubmode] = useState<Submode>(null);
    const [bubbleText, setBubbleText] = useState<string>(
        "Define una ruta desde T.U.M. hasta la zona frondosa. Evita el río y el árbol caído."
    );
    const [showVictory, setShowVictory] = useState<boolean>(false);

    const cols = 6;
    const rows = 5;
    const maxEnergy = 12;

    const obstacles = [
        { x: 3, y: 0, type: 'tree' },
        { x: 2, y: 1, type: 'river' },
        { x: 4, y: 2, type: 'tree' },
        { x: 1, y: 3, type: 'river' },
        { x: 2, y: 3, type: 'river' },
    ];

    const collectibles = [
        { x: 1, y: 1, type: 'seed' },
        { x: 4, y: 3, type: 'bromelia' }
    ];

    const isObstacle = useCallback((x: number, y: number) => {
        return obstacles.some(obs => obs.x === x && obs.y === y);
    }, []);

    const isCollectible = useCallback((x: number, y: number, type: string) => {
        return collectibles.some(col => col.x === x && col.y === y && col.type === type);
    }, []);

    const hasObstacleInPath = useCallback(() => {
        return path.some(pos => isObstacle(pos.x, pos.y));
    }, [path, isObstacle]);

    const calculateStats = useCallback(() => {
        let seeds = 0;
        let bromelias = 0;
        path.forEach(pos => {
            if (isCollectible(pos.x, pos.y, 'seed')) seeds += 1;
            if (isCollectible(pos.x, pos.y, 'bromelia')) bromelias += 4;
        });
        return { seeds, bromelias };
    }, [path, isCollectible]);

    const { seeds: collectedSeeds, bromelias: collectedBromelias } = calculateStats();

    const handleCellClick = (x: number, y: number) => {
        if (showVictory) return;

        const pathIndex = path.findIndex(pos => pos.x === x && pos.y === y);
        if (pathIndex !== -1) {
            setPath(path.slice(0, pathIndex + 1));
            return;
        }

        const last = path[path.length - 1];
        const isAdjacent = Math.abs(last.x - x) + Math.abs(last.y - y) === 1;

        if (isAdjacent) {
            const nextPath = [...path, { x, y }];
            setPath(nextPath);
        }
    };

    useEffect(() => {
        const last = path[path.length - 1];
        const steps = path.length - 1;

        if (isObstacle(last.x, last.y)) {
            setBubbleText("Ups!, ten cuidado con T.U.M.");
        } else if (steps > maxEnergy) {
            setBubbleText("Sin energía suficiente. Acorta la ruta.");
        } else if (last.x === 5 && last.y === 4) {
            setBubbleText("¡Excelente! Has llegado a la meta. Presiona Iniciar.");
        } else {
            setBubbleText("Define una ruta desde T.U.M. hasta la zona frondosa. Evita el río y el árbol caído.");
        }
    }, [path, isObstacle]);

    const togglePowerup = (id: string) => {
        setSelectedPowerups(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleIniciar = () => {
        const last = path[path.length - 1];
        const steps = path.length - 1;

        if (last.x !== 5 || last.y !== 4) return;
        if (hasObstacleInPath()) return;
        if (steps > maxEnergy) return;

        setShowVictory(true);
    };

    const handleReset = () => {
        setPath([{ x: 0, y: 0 }]);
        setShowVictory(false);
    };

    const isCellInPath = (x: number, y: number) => {
        return path.some(pos => pos.x === x && pos.y === y);
    };

    const getCellPathIndex = (x: number, y: number) => {
        return path.findIndex(pos => pos.x === x && pos.y === y);
    };

    return (
        <div className="gt-game-overlay animate-fade-in">
            <div className="gt-game-container">
                
                {/* Cabecera superior */}
                <div className="gt-header">
                    <div className="gt-header-left">
                        <div className="gt-energy-pill">
                            <div className="gt-energy-title-row">
                                <div className="gt-energy-icon-label">
                                    <span>🔋</span>
                                    <span>Energía de T.U.M.</span>
                                </div>
                                <span>{showVictory ? '100%' : '22%'}</span>
                            </div>
                            <div className="gt-energy-bar">
                                <div className="gt-energy-fill" style={{ width: showVictory ? '100%' : '22%' }}></div>
                            </div>
                        </div>

                        <div className="gt-mission-pill">
                            <span className="gt-mission-label">MISIÓN 1 DE 3</span>
                            <span className="gt-mission-title">Traza la ruta de T.U.M.</span>
                        </div>
                    </div>

                    <div className="gt-header-center">
                        <button className="gt-circle-btn" onClick={handleReset} aria-label="Repetir">
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
                            <div className="gt-pill-icon-circle gt-purple-bg">🌸</div>
                            <span>{collectedBromelias}</span>
                        </div>
                        <div className="gt-status-pill">
                            <div className="gt-pill-icon-circle gt-yellow-bg">🌱</div>
                            <span>{collectedSeeds}</span>
                        </div>
                        <div className="gt-insignia-pill">
                            🎖️ Insignias
                        </div>
                        <div className="gt-compass-pill">
                            <Compass size={22} />
                        </div>
                    </div>
                </div>

                {/* Área de Juego */}
                <div className="gt-gameplay-container">
                    
                    {/* Panel de Controles Izquierdo */}
                    <div className="gt-control-panel">
                        <div className="gt-panel-header">
                            <span className="gt-energy-icon">⚡</span>
                            <span className="gt-panel-energy-title">
                                Energía {Math.max(0, maxEnergy - (path.length - 1))}/{maxEnergy}
                            </span>
                            <span className="gt-panel-steps">
                                ▷ {path.length - 1} pasos
                            </span>
                        </div>

                        <div className="gt-powerups-section">
                            <span className="gt-powerups-title">POWER-UPS</span>
                            
                            <div className="gt-powerups-grid">
                                <button 
                                    className={`gt-powerup-card ${selectedPowerups.includes('bloqueo') ? 'selected' : ''}`}
                                    onClick={() => togglePowerup('bloqueo')}
                                >
                                    <div className="gt-powerup-badge">1</div>
                                    <Shield size={20} className="gt-powerup-icon" />
                                    <span className="gt-powerup-name">Bloqueo</span>
                                    <span className="gt-powerup-desc">3 pasos sin gastar energía</span>
                                </button>

                                <button 
                                    className={`gt-powerup-card ${selectedPowerups.includes('turbo') ? 'selected' : ''}`}
                                    onClick={() => togglePowerup('turbo')}
                                >
                                    <div className="gt-powerup-badge">1</div>
                                    <Zap size={20} className="gt-powerup-icon" />
                                    <span className="gt-powerup-name">Turbo</span>
                                    <span className="gt-powerup-desc">Atraviesa un obstáculo simple</span>
                                </button>

                                <button 
                                    className={`gt-powerup-card ${selectedPowerups.includes('brujula') ? 'selected' : ''}`}
                                    onClick={() => togglePowerup('brujula')}
                                >
                                    <div className="gt-powerup-badge">2</div>
                                    <Compass size={20} className="gt-powerup-icon" />
                                    <span className="gt-powerup-name">Brújula</span>
                                    <span className="gt-powerup-desc">Sugiere una ruta parcial</span>
                                </button>
                            </div>
                        </div>

                        <div className="gt-panel-footer">
                            <button className="gt-clear-btn" onClick={handleReset}>
                                <RefreshCw size={16} />
                                <span>Borrar ruta</span>
                            </button>
                            
                            <button 
                                className={`gt-start-btn ${(path[path.length - 1].x === 5 && path[path.length - 1].y === 4 && !hasObstacleInPath() && (path.length - 1) <= maxEnergy) ? 'active' : ''}`}
                                onClick={handleIniciar}
                            >
                                <Play size={16} fill="currentColor" />
                                <span>Iniciar recorrido</span>
                            </button>
                        </div>
                    </div>

                    {/* Tablero Central */}
                    <div className="gt-board-wrapper">
                        <div className="gt-grid-container">
                            <div className="gt-game-grid">
                                {Array.from({ length: rows }).map((_, y) => (
                                    <div key={y} className="gt-grid-row">
                                        {Array.from({ length: cols }).map((_, x) => {
                                            const isStart = x === 0 && y === 0;
                                            const isGoal = x === 5 && y === 4;
                                            const obstacle = obstacles.find(obs => obs.x === x && obs.y === y);
                                            const seed = collectibles.find(col => col.x === x && col.y === y && col.type === 'seed');
                                            const bromelia = collectibles.find(col => col.x === x && col.y === y && col.type === 'bromelia');
                                            
                                            const inPath = isCellInPath(x, y);
                                            const pathIndex = getCellPathIndex(x, y);
                                            const isLastOfPath = pathIndex === path.length - 1;
                                            const hasError = inPath && isObstacle(x, y);

                                            return (
                                                <div 
                                                    key={x} 
                                                    className={`gt-grid-cell 
                                                        ${isStart ? 'is-start' : ''} 
                                                        ${isGoal ? 'is-goal' : ''} 
                                                        ${inPath ? 'in-path' : ''} 
                                                        ${hasError ? 'has-error' : ''}
                                                    `}
                                                    onClick={() => handleCellClick(x, y)}
                                                >
                                                    {/* Mostrar línea de conexión visual */}
                                                    {inPath && pathIndex > 0 && (
                                                        <div className={`gt-path-connector dir-${
                                                            path[pathIndex].x > path[pathIndex - 1].x ? 'right' :
                                                            path[pathIndex].x < path[pathIndex - 1].x ? 'left' :
                                                            path[pathIndex].y > path[pathIndex - 1].y ? 'down' : 'up'
                                                        }`} />
                                                    )}

                                                    {/* Contenido de la celda */}
                                                    {isStart && !isLastOfPath && (
                                                        <div className="gt-bear-avatar">🐻</div>
                                                    )}
                                                    {isLastOfPath && (
                                                        <div className="gt-bear-avatar active">🐻</div>
                                                    )}
                                                    {!inPath && obstacle?.type === 'tree' && (
                                                        <span className="gt-obstacle-icon">🌲</span>
                                                    )}
                                                    {!inPath && obstacle?.type === 'river' && (
                                                        <span className="gt-obstacle-icon">🌊</span>
                                                    )}
                                                    {!inPath && seed && (
                                                        <span className="gt-collectible-icon">🌱</span>
                                                    )}
                                                    {!inPath && bromelia && (
                                                        <span className="gt-collectible-icon">🌸</span>
                                                    )}
                                                    {isGoal && !isLastOfPath && (
                                                        <span className="gt-goal-flag">⚐</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Globo de Diálogo de T.U.M. Izquierdo/Derecho */}
                    <div className="gt-dialog-panel">
                        <div className="gt-dialog-box">
                            <span className="gt-dialog-tag">T.U.M. <span className="gt-dialog-subtag">IA · VOZ</span></span>
                            <p className="gt-dialog-text">{bubbleText}</p>
                        </div>

                        {/* Botones de acción inferiores derechos */}
                        <div className="gt-bottom-actions">
                            <button 
                                className={`gt-action-circle ${submode === 'tablet' ? 'active' : ''}`}
                                onClick={() => setSubmode(submode === 'tablet' ? null : 'tablet')}
                            >
                                <Tablet size={22} />
                                <span className="gt-circle-label">Tablet</span>
                            </button>
                            
                            <button 
                                className={`gt-action-circle ${submode === 'lidar' ? 'active' : ''}`}
                                onClick={() => setSubmode(submode === 'lidar' ? null : 'lidar')}
                            >
                                <Camera size={22} />
                                <span className="gt-circle-label">Cámara / LIDAR</span>
                            </button>

                            <button 
                                className={`gt-action-circle ${submode === 'observar' ? 'active' : ''}`}
                                onClick={() => setSubmode(submode === 'observar' ? null : 'observar')}
                            >
                                <Eye size={22} />
                                <span className="gt-circle-label">Observar</span>
                            </button>
                        </div>
                    </div>

                </div>

                {/* Modal de Victoria */}
                {showVictory && (
                    <div className="gt-victory-overlay">
                        <div className="gt-victory-card">
                            <div className="gt-victory-bear">🐻</div>
                            
                            <h3 className="gt-victory-title">¡Ruta perfecta!</h3>
                            <span className="gt-victory-subtitle">Primer sendero - {path.length - 1} pasos</span>

                            <div className="gt-rewards-list">
                                <div className="gt-reward-row">
                                    <div className="gt-reward-icon-circle purple">🌸</div>
                                    <span className="gt-reward-text">+{collectedBromelias} Bromelias</span>
                                </div>
                                <div className="gt-reward-row">
                                    <div className="gt-reward-icon-circle yellow">🌱</div>
                                    <span className="gt-reward-text">+{collectedSeeds} Semilla del Bosque</span>
                                </div>
                                <div className="gt-reward-row">
                                    <div className="gt-reward-icon-circle green">⚡</div>
                                    <span className="gt-reward-text">+7% Energía</span>
                                </div>
                                <div className="gt-reward-row">
                                    <div className="gt-reward-icon-circle gold">🎖️</div>
                                    <span className="gt-reward-text">Insignia "Ruta perfecta"</span>
                                </div>
                            </div>

                            <div className="gt-victory-buttons">
                                <button className="gt-next-level-btn" onClick={onClose}>
                                    Siguiente nivel
                                </button>
                                <button className="gt-replay-level-btn" onClick={handleReset}>
                                    Repetir nivel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
