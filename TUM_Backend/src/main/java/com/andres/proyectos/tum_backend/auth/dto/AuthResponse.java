package com.andres.proyectos.tum_backend.auth.dto;

import com.andres.proyectos.tum_backend.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    public String token;
    public Role role;
}
