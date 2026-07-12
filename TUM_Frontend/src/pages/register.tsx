import { useState } from "react";
import type { RegisterRequest } from "../types/types";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import '../styles/register.css';

import exploradorImg from "../assets/Explorador.png";
import aprendizImg from "../assets/AprendizStem.png";
import jovenInnovadorImg from "../assets/JovenInnovador.png";
import mentorCreativoImg from "../assets/MentorCreativo.png";

export const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const roleOptions = [
        {
            value: "EXPLORADOR",
            label: "Explorador",
            image: exploradorImg,
        },
        {
            value: "APRENDIZ_STEM",
            label: "Aprendiz STEM",
            image: aprendizImg,
        },
        {
            value: "JOVEN_INNOVADOR",
            label: "Joven Innovador",
            image: jovenInnovadorImg,
        },
        {
            value: "MENTOR_CREATIVO",
            label: "Mentor Creativo",
            image: mentorCreativoImg,
        },
    ];

    const [form, setForm] = useState<RegisterRequest>({ nombre: "", email: "", password: "", role: "EXPLORADOR"});
    const [age, setAge] = useState<number>(0);
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
    
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg(null);
        
        if(age > 100 || age < 8){
            setErrorMsg("La edad debe estar entre 8 y 100 años. Por favor, inténtalo de nuevo.");
            return;
        }

        if(form.password !== confirmPassword){
            setErrorMsg("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
            return;
        }

        try {
            await register(form);
        } catch (error) {
            setErrorMsg("Error al registrar. Por favor, inténtalo de nuevo.");
        }
    }

    return (
        <div className="register-wrapper animate-fade-in">

            <button className="login-back-btn" onClick={() => navigate('/')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Volver</span>
            </button>

            <div className="register-card">
                <div className="register-form-section">
                    <h2 className="register-title">REGISTRATE</h2>
                    <p className="register-subtitle">Estás registrándote</p>

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="input-group">
                            <label>Nombre</label>
                            <div className="input-field-wrapper">
                                <span className="input-icon">A</span>
                                <input
                                    type="text"
                                    onChange={(e) => setForm({...form, nombre: e.target.value})}
                                    placeholder="Tu nombre"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <div className="input-field-wrapper">
                                <span className="input-icon">@</span>
                                <input
                                    type="email"
                                    onChange={(e) => setForm({...form, email: e.target.value})}
                                    placeholder="tucuenta@gmail.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Edad</label>
                            <div className="input-field-wrapper">
                                <span className="input-icon">◌</span>
                                <input
                                    type="number"
                                    onChange={(e) => setAge(parseInt(e.target.value, 10))}
                                    placeholder="8 a 100 años"
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
                                    onChange={(e) => setForm({...form, password: e.target.value})}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Confirmar Contraseña</label>
                            <div className="input-field-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    type="password"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {errorMsg && <p className="error-message">{errorMsg}</p>}

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

                    <p className="login-register-link">
                        ¿Ya estás registrado? <Link to="/login">Inicia sesión</Link>
                    </p>
                </div>

                <div className="register-bear-section">
                    <button 
                        type="button" 
                        className="rank-info-btn"
                        onClick={() => setShowInfoModal(true)}
                        aria-label="Información de rangos"
                    >
                        i
                    </button>
                    <div className="register-bear-grid" role="radiogroup" aria-label="Selecciona tu rango">
                        {roleOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`register-bear-option ${form.role === option.value ? "is-selected" : ""}`}
                                onClick={() => setForm({ ...form, role: option.value })}
                                aria-pressed={form.role === option.value}
                            >
                                <img src={option.image} alt={option.label} className="register-bear-img" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal de Información de Rangos */}
            {showInfoModal && (
                <div className="rank-modal-overlay" onClick={() => setShowInfoModal(false)}>
                    <div className="rank-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="rank-modal-title">¿Qué significan los rangos?</h3>
                        
                        <div className="rank-rows">
                            <div className="rank-row">
                                <div className="rank-badge-wrapper">
                                    <img src={exploradorImg} alt="Explorador Curioso" className="rank-badge-img" />
                                </div>
                                <div className="rank-text-content">
                                    <h4 className="rank-row-title">Explorador Curioso (8 a 11 años)</h4>
                                    <p>Es el inicio de tu viaje. Aquí comienzas a descubrir el mundo de la ciencia, la naturaleza y la tecnología de forma divertida. Aprendes jugando, experimentando y haciendo tus primeras creaciones con ayuda de T.U.M.</p>
                                </div>
                            </div>

                            <div className="rank-row">
                                <div className="rank-badge-wrapper">
                                    <img src={aprendizImg} alt="Aprendiz STEM" className="rank-badge-img" />
                                </div>
                                <div className="rank-text-content">
                                    <h4 className="rank-row-title">Aprendiz STEM (12 a 15 años)</h4>
                                    <p>Ya tienes más curiosidad y ganas de entender cómo funcionan las cosas. En este rango exploras robótica, programación y pequeños proyectos científicos. T.U.M. te guía para que aprendas a resolver problemas y a pensar como un inventor.</p>
                                </div>
                            </div>

                            <div className="rank-row">
                                <div className="rank-badge-wrapper">
                                    <img src={jovenInnovadorImg} alt="Joven Innovador" className="rank-badge-img" />
                                </div>
                                <div className="rank-text-content">
                                    <h4 className="rank-row-title">Joven Innovador (16 a 19 años)</h4>
                                    <p>Es tu momento de crear. Aquí desarrollas tus propias ideas, proyectos y soluciones. Aprendes a trabajar en equipo, a usar herramientas más avanzadas y a convertir tus ideas en algo real. T.U.M. se convierte en tu compañero de innovación.</p>
                                </div>
                            </div>

                            <div className="rank-row">
                                <div className="rank-badge-wrapper">
                                    <img src={mentorCreativoImg} alt="Mentor Creativo" className="rank-badge-img" />
                                </div>
                                <div className="rank-text-content">
                                    <h4 className="rank-row-title">Mentor Creativo (20 a 23 años)</h4>
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
    );
}