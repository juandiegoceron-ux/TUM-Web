import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AuthCredentials, AuthResponse, RegisterRequest } from "../types/types";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    nombre: string;
    role: string;
    exp: number;
    sub: string;
}

interface AuthContextType {
    token: string | null;
    nombre: string | null;
    email: string | null;
    role: string | null;
    login: (credentials: AuthCredentials) => Promise<void>;
    register: (credentials: RegisterRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    const decodedToken = useMemo(() => {
        if (!token) return null;
        try {
            return jwtDecode<JwtPayload>(token);
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    }, [token]);

    const nombre = decodedToken ? decodedToken.nombre : null;
    const email = decodedToken ? decodedToken.sub : null;
    var role = decodedToken ? decodedToken.role : null;

    switch(role) {
        case "ROLE_EXPLORADOR":
            role = "Explorador";
            break;
        case "ROLE_APRENDIZ_STEM":
            role = "Aprendiz STEM";
            break;
        case "ROLE_JOVEN_INNOVADOR":
            role = "Joven Innovador";
            break;
        case "ROLE_MENTOR_CREATIVO":
            role = "Mentor Creativo";
            break;
    }

    const logout = useCallback((redirectTo = '/login') => {
        localStorage.removeItem("token");
        setToken(null);
        navigate(redirectTo);
    }, [navigate]);
    
    useEffect(() => {
        if(token) {
            try {
                const currentTime = Date.now() / 1000;
                const timeLeft = (decodedToken!.exp - currentTime) * 1000;

                if(timeLeft <= 0) {
                    logout();
                } else {
                    const timer = setTimeout(() => {
                        logout('/login?expired=true');
                    }, timeLeft);

                    return () => clearTimeout(timer);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, [token]);

    const login = async (credentials: AuthCredentials) => {
        try {
            const response = await api.post<AuthResponse>("/auth/login", credentials);
            const { token } = response.data;

            setToken(token);
            localStorage.setItem("token", token);
            navigate("/dashboard");
        } catch (error) {
            console.warn("Backend offline. Iniciando sesión simulada de desarrollo.");
            // Token simulado con: nombre = Explorador Local, role = ROLE_EXPLORADOR, exp = año 2033
            const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21icmUiOiJFeHBsb3JhZG9yIExvY2FsIiwicm9sZSI6IlJPTEVfRVhQTE9SQURPUiIsImV4cCI6MTk5OTk5OTk5OSwic3ViIjoidGVzdEB0ZXN0LmNvbSJ9.dummy";
            setToken(mockToken);
            localStorage.setItem("token", mockToken);
            navigate("/dashboard");
        }
    };

    const register = async (credentials: RegisterRequest) => {
        try {
            await api.post("/auth/register", credentials);
        } catch (error) {
            console.warn("Backend offline. Simulando registro exitoso.");
        }
    };

    return (
        <AuthContext.Provider value={{ token, login, register, logout, nombre, email, role }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return context;
};
