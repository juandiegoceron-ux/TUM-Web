package com.andres.proyectos.tum_backend.auth.dto;

import com.andres.proyectos.tum_backend.user.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String nombre;
    private Role role;
}
