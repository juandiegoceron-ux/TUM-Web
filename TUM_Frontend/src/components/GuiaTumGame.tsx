import { useState, useEffect, useCallback } from 'react';
import { RotateCcw, LogOut, Compass, Tablet, Camera, Eye } from 'lucide-react';
import '../styles/guia_tum.css';

interface GuiaTumGameProps {
    onClose: () => void;
}

type Difficulty = 'infantil' | 'adulto';
type GameState = 'lobby' | 'playing' | 'victory' | 'gameover';
type Submode = 'map' | 'tablet' | 'lidar' | 'observar';

interface GridCell {
    x: number;
    y: number;
    type: 'empty' | 'threat' | 'food' | 'sprout' | 'goal';
    scanned: boolean;
}

export const GuiaTumGame = ({ onClose }: GuiaTumGameProps) => {
    const [gameState, setGameState] = useState<GameState>('lobby');
    const [difficulty, setDifficulty] = useState<Difficulty>('infantil');
    const [submode, setSubmode] = useState<Submode>('map');
    
    const [energy, setEnergy] = useState<number>(22); 
    const [sproutsCollected, setSproutsCollected] = useState<number>(0);
    const [treesPlanted, setTreesPlanted] = useState<number>(0);
    const [hasInsignia, setHasInsignia] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(60);
    
    const [grid, setGrid] = useState<GridCell[]>([]);
    const [bearPos, setBearPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const initBoard = useCallback((selectedDiff: Difficulty) => {
        const newGrid: GridCell[] = [];
        const size = 6;
        
        const items = [
            { x: 1, y: 1, type: 'sprout' },
            { x: 3, y: 0, type: 'food' },
            { x: 0, y: 4, type: 'sprout' },
            { x: 2, y: 4, type: 'food' },
            { x: 4, y: 2, type: 'sprout' },
            { x: 2, y: 1, type: 'threat' },
            { x: 1, y: 3, type: 'threat' },
            { x: 3, y: 3, type: 'threat' },
            { x: 5, y: 2, type: 'threat' },
            { x: 4, y: 4, type: 'threat' },
        ];

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (x === 0 && y === 0) {
                    newGrid.push({ x, y, type: 'empty', scanned: true });
                } else if (x === size - 1 && y === size - 1) {
                    newGrid.push({ x, y, type: 'goal', scanned: true });
                } else {
                    const match = items.find(item => item.x === x && item.y === y);
                    newGrid.push({
                        x,
                        y,
                        type: (match ? match.type : 'empty') as any,
                        scanned: selectedDiff === 'infantil'
                    });
                }
            }
        }
        
        setGrid(newGrid);
        setBearPos({ x: 0, y: 0 });
        setEnergy(selectedDiff === 'infantil' ? 100 : 50);
        setSproutsCollected(0);
        setTreesPlanted(0);
        setTimeLeft(45);
    }, []);

    const handleSelectDifficulty = (selectedDiff: Difficulty) => {
        setDifficulty(selectedDiff);
        initBoard(selectedDiff);
        setGameState('playing');
    };

    useEffect(() => {
        if (gameState !== 'playing' || difficulty !== 'adulto') return;
        
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setGameState('gameover');
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState, difficulty]);

    const moveBear = useCallback((dx: number, dy: number) => {
        if (gameState !== 'playing') return;

        const newX = Math.min(5, Math.max(0, bearPos.x + dx));
        const newY = Math.min(5, Math.max(0, bearPos.y + dy));

        if (newX === bearPos.x && newY === bearPos.y) return;

        let energyLoss = difficulty === 'adulto' ? 2 : 0; 
        let energyGain = 0;
        let scoreGain = 0;
        let treeGain = 0;

        const targetCellIndex = grid.findIndex(cell => cell.x === newX && cell.y === newY);
        const updatedGrid = [...grid];
        const targetCell = updatedGrid[targetCellIndex];

        if (targetCell) {
            targetCell.scanned = true;

            if (targetCell.type === 'threat') {
                energyLoss += 15;
            } else if (targetCell.type === 'food') {
                energyGain += 20; 
                targetCell.type = 'empty';
            } else if (targetCell.type === 'sprout') {
                scoreGain += 1;
                treeGain += 1;
                targetCell.type = 'empty';
            } else if (targetCell.type === 'goal') {
                setGameState('victory');
                setHasInsignia(true);
            }
        }

        setEnergy((prev) => {
            const nextEnergy = Math.min(100, Math.max(0, prev - energyLoss + energyGain));
            if (nextEnergy <= 0) {
                setGameState('gameover');
            }
            return nextEnergy;
        });

        if (scoreGain > 0) setSproutsCollected(prev => prev + scoreGain);
        if (treeGain > 0) setTreesPlanted(prev => prev + treeGain);
        
        setBearPos({ x: newX, y: newY });
        setGrid(updatedGrid);
    }, [bearPos, difficulty, grid, gameState]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState !== 'playing') return;
            
            if (e.key === 'ArrowUp' || e.key === 'w') moveBear(0, -1);
            else if (e.key === 'ArrowDown' || e.key === 's') moveBear(0, 1);
            else if (e.key === 'ArrowLeft' || e.key === 'a') moveBear(-1, 0);
            else if (e.key === 'ArrowRight' || e.key === 'd') moveBear(1, 0);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, moveBear]);

    const handleLidarScan = () => {
        if (gameState !== 'playing') return;
        setSubmode('lidar');
        
        const updatedGrid = grid.map(cell => {
            const distance = Math.abs(cell.x - bearPos.x) + Math.abs(cell.y - bearPos.y);
            if (distance <= 2) {
                return { ...cell, scanned: true };
            }
            return cell;
        });
        setGrid(updatedGrid);
        
        if (difficulty === 'adulto') {
            setEnergy(prev => Math.max(0, prev - 5));
        }
    };

    return (
        <div className="gt-game-overlay animate-fade-in">
            <div className="gt-game-container">
                
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
                        <button className="gt-circle-btn" onClick={() => initBoard(difficulty)} aria-label="Repetir">
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
                            <span>{treesPlanted}</span>
                        </div>
                        <div className="gt-status-pill">
                            <div className="gt-pill-icon-circle gt-yellow-bg">🌱</div>
                            <span>{sproutsCollected}</span>
                        </div>
                        {hasInsignia && (
                            <div className="gt-insignia-pill">
                                🎖️ Insignia
                            </div>
                        )}
                        <div className="gt-compass-pill">
                            <Compass size={22} />
                        </div>
                    </div>
                </div>

                {gameState === 'lobby' ? (
                    <div className="gt-main-lobby">
                        <div className="gt-lobby-card">
                            <span className="gt-lobby-subtitle">MJ #1 · GUÍA A T.U.M.</span>
                            <h2 className="gt-lobby-title">Elige tu dificultad</h2>
                            <p className="gt-lobby-desc">
                                T.U.M. se perdió en una zona nueva del Bosque Andino. Traza la mejor ruta para llevarlo a un lugar con comida, agua y árboles frondosos.
                            </p>

                            <div className="gt-lobby-modes">
                                <div className="gt-mode-card" onClick={() => handleSelectDifficulty('infantil')}>
                                    <span className="gt-mode-label">NIÑAS Y NIÑOS</span>
                                    <h3 className="gt-mode-title">Modo Infantil</h3>
                                    <ul className="gt-mode-bullets">
                                        <li><span className="gt-bullet-dot"></span>Define una ruta libre</li>
                                        <li><span className="gt-bullet-dot"></span>Sin límite de tiempo</li>
                                        <li><span className="gt-bullet-dot"></span>Energía generosa</li>
                                    </ul>
                                </div>

                                <div className="gt-mode-card" onClick={() => handleSelectDifficulty('adulto')}>
                                    <span className="gt-mode-label">RETO DE EFICIENCIA</span>
                                    <h3 className="gt-mode-title">Modo Adolescente / Adulto</h3>
                                    <ul className="gt-mode-bullets">
                                        <li><span className="gt-bullet-dot"></span>Busca la ruta más corta</li>
                                        <li><span className="gt-bullet-dot"></span>Tiempo límite activo</li>
                                        <li><span className="gt-bullet-dot"></span>Anticipa los riesgos</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="gt-gameplay-container">
                        
                        <div className="gt-game-board-panel">
                            {gameState === 'victory' && (
                                <div className="gt-result-overlay">
                                    <span className="gt-result-emoji">🎉🐻</span>
                                    <h3 className="gt-result-title">¡Misión Cumplida!</h3>
                                    <p className="gt-result-desc">
                                        Has guiado a T.U.M. exitosamente a través del Bosque Andino.
                                    </p>
                                    <button className="gt-result-btn" onClick={() => setGameState('lobby')}>
                                        Jugar de nuevo
                                    </button>
                                </div>
                            )}

                            {gameState === 'gameover' && (
                                <div className="gt-result-overlay">
                                    <span className="gt-result-emoji">😢🍂</span>
                                    <h3 className="gt-result-title">Juego Terminado</h3>
                                    <p className="gt-result-desc">
                                        {energy <= 0 
                                            ? "T.U.M. se quedó sin energía en el camino." 
                                            : "El tiempo límite ha expirado."
                                        }
                                    </p>
                                    <button className="gt-result-btn" onClick={() => handleSelectDifficulty(difficulty)}>
                                        Reintentar
                                    </button>
                                </div>
                            )}

                            <div className="gt-grid">
                                {grid.map((cell) => {
                                    const isBear = bearPos.x === cell.x && bearPos.y === cell.y;
                                    const showItem = cell.scanned || difficulty === 'infantil';
                                    
                                    return (
                                        <div 
                                            key={`${cell.x}-${cell.y}`} 
                                            className={`gt-cell ${isBear ? 'has-tum' : ''} ${cell.type === 'goal' ? 'is-goal' : ''} ${cell.scanned ? 'is-scanned' : ''}`}
                                            onClick={() => {
                                                const dx = cell.x - bearPos.x;
                                                const dy = cell.y - bearPos.y;
                                                if (Math.abs(dx) + Math.abs(dy) === 1) {
                                                    moveBear(dx, dy);
                                                }
                                            }}
                                        >
                                            {isBear ? (
                                                <span className="gt-bear-emoji">🐻</span>
                                            ) : (
                                                <>
                                                    {cell.type === 'goal' && <span className="gt-cell-badge">🏡</span>}
                                                    {showItem && cell.type === 'threat' && <span className="gt-cell-badge">⚠️</span>}
                                                    {showItem && cell.type === 'food' && <span className="gt-cell-badge">🍎</span>}
                                                    {showItem && cell.type === 'sprout' && <span className="gt-cell-badge">🌱</span>}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="gt-sidebar-panel">
                            <div className="gt-sidebar-top">
                                <h3>{difficulty === 'infantil' ? 'Modo Infantil' : 'Reto Adulto'}</h3>
                                <p>
                                    {difficulty === 'infantil' 
                                        ? 'Explora el mapa libremente. Los alimentos aumentan tu energía y los brotes de plantas te otorgan puntos.' 
                                        : 'Planifica bien. Cada movimiento consume energía. Usa el sensor LIDAR para escanear y encontrar amenazas ocultas.'
                                    }
                                </p>

                                <div className="gt-stats-list">
                                    {difficulty === 'adulto' && (
                                        <div className="gt-stat-row">
                                            <span className="gt-stat-name">Tiempo restante:</span>
                                            <span className="gt-stat-value" style={{ color: timeLeft < 15 ? '#ff5b5b' : '#ffffff' }}>
                                                {timeLeft}s
                                            </span>
                                        </div>
                                    )}
                                    <div className="gt-stat-row">
                                        <span className="gt-stat-name">Posición de T.U.M:</span>
                                        <span className="gt-stat-value">X: {bearPos.x}, Y: {bearPos.y}</span>
                                    </div>
                                    <div className="gt-stat-row">
                                        <span className="gt-stat-name">Destino Seguro:</span>
                                        <span className="gt-stat-value">🏡 Refugio (5, 5)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="gt-controls-guide">
                                <span className="gt-controls-title">CONTROLES</span>
                                <div className="gt-arrows-grid">
                                    <div></div>
                                    <button className="gt-arrow-key" onClick={() => moveBear(0, -1)}>▲</button>
                                    <div></div>
                                    <button className="gt-arrow-key" onClick={() => moveBear(-1, 0)}>◀</button>
                                    <button className="gt-arrow-key" onClick={() => moveBear(0, 1)}>▼</button>
                                    <button className="gt-arrow-key" onClick={() => moveBear(1, 0)}>▶</button>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                <div className="gt-footer-actions">
                    <div className="gt-action-btn-container">
                        <button 
                            className={`gt-circle-action-btn ${submode === 'tablet' ? 'active' : ''}`}
                            onClick={() => { setSubmode('tablet'); }}
                            aria-label="Tablet"
                        >
                            <Tablet size={24} />
                        </button>
                        <span className="gt-action-label">Tablet</span>
                    </div>

                    <div className="gt-action-btn-container">
                        <button 
                            className={`gt-circle-action-btn ${submode === 'lidar' ? 'active' : ''}`}
                            onClick={handleLidarScan}
                            aria-label="LIDAR"
                        >
                            <Camera size={24} />
                        </button>
                        <span className="gt-action-label">Cámara / LIDAR</span>
                    </div>

                    <div className="gt-action-btn-container">
                        <button 
                            className={`gt-circle-action-btn ${submode === 'observar' ? 'active' : ''}`}
                            onClick={() => { setSubmode('observar'); }}
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
