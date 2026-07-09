import React, { useState } from "react";
import "../styles/login.css";
import osito1 from "../assets/osito1.png";
import googleLogo from "../assets/google.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Login() {
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({email: "", password: ""});
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const isExpired = searchParams.get("expired") === "true";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg(null);

        try {
            await login(form);
        } catch (error) {
            setErrorMsg("Credenciales inválidas. Por favor, inténtalo de nuevo.");
        }

    };

    return (
        <div className="login-wrapper animate-fade-in">
            {/* Back to welcome link */}
            <button className="login-back-btn" onClick={() => navigate('/')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Volver</span>
            </button>

            <div className="login-card">
                {/* Left: Peeking Bear Illustration */}
                <div className="login-bear-section">
                    <img
                        src={osito1}
                        alt="Oso Andino Asomado"
                        className="login-bear-img"
                    />
                </div>

                {/* Right: Form */}
                <div className="login-form-section">
                    <h2 className="login-title">INICIA SESIÓN</h2>
                    <p className="login-subtitle">
                        Tu cuenta define tu perfil de explorador
                    </p>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-group">
                            <label>Nombre / correo</label>
                            <div className="input-field-wrapper">
                                <span className="input-icon">@</span>
                                <input
                                    type="text"
                                    onChange={(e) => setForm({...form, email: e.target.value})}
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
                                    onChange={(e) => setForm({...form, password: e.target.value})}
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
                        ¿No estás registrado? <Link to="/register">Crea tu cuenta</Link>
                    </p>

                    {/* Google login option */}
                    <button className="login-google-btn">
                        <img
                            src={googleLogo}
                            alt="Google logo"
                            className="google-icon"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
