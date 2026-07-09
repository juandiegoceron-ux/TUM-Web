export type Page = 'welcome' | 'login' | 'dashboard'

export interface User {
    name: string
    email: string
}

export interface UserCredentials {
    nombre?: string
    email: string
    password: string
    role?: string
}

export interface RegisterRequest {
    nombre: string
    email: string
    password: string
    role: string
}

export interface AuthCredentials {
    email: string
    password: string
}

export interface AuthResponse {
    token: string;
}