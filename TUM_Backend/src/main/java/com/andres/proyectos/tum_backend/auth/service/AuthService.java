package com.andres.proyectos.tum_backend.auth.service;

import com.andres.proyectos.tum_backend.auth.dto.AuthRequest;
import com.andres.proyectos.tum_backend.auth.dto.AuthResponse;
import com.andres.proyectos.tum_backend.auth.dto.RegisterRequest;
import com.andres.proyectos.tum_backend.user.Role;
import com.andres.proyectos.tum_backend.user.User;
import com.andres.proyectos.tum_backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public void register(RegisterRequest request) {
        if(!request.getEmail().contains("@") || !request.getEmail().contains(".") || request.getEmail().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Datos inválidos, correo vacío o formato incorrecto");
        }
        if(userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Correo ya registrado");
        }
        if(request.getPassword().length() < 8){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña debe tener al menos 8 caracteres");
        }

        var user = User.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        userRepository.save(user);

    }

    public AuthResponse login(AuthRequest request) {
        try {
            var user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("nombre", user.getNombre());

            String jwtToken = jwtService.generateToken(user, extraClaims);

            return AuthResponse.builder()
                    .token(jwtToken)
                    .build();
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }
    }

}
