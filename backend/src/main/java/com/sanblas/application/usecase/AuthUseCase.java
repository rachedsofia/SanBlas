package com.sanblas.application.usecase;

import com.sanblas.application.dto.request.LoginRequest;
import com.sanblas.application.dto.response.AuthResponse;
import com.sanblas.infrastructure.persistence.repository.UsuarioJpaRepository;
import com.sanblas.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class AuthUseCase {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UsuarioJpaRepository usuarioRepo;

    @Transactional
    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.password()));

        var usuario = usuarioRepo.findByEmail(req.email())
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        usuario.setUltimoLogin(LocalDateTime.now());
        usuarioRepo.save(usuario);

        Set<String> permisos = usuario.getRol().getPermisos().stream()
            .map(p -> p.getCodigo()).collect(Collectors.toSet());

        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", usuario.getRol().getNombre());
        claims.put("permisos", permisos);
        claims.put("sucursalId", usuario.getSucursal() != null ? usuario.getSucursal().getId() : null);

        String token = jwtService.generateToken(usuario, claims);

        return new AuthResponse(
            token, usuario.getEmail(),
            usuario.getNombre() + " " + usuario.getApellido(),
            usuario.getRol().getNombre(),
            usuario.getSucursal() != null ? usuario.getSucursal().getId() : null,
            usuario.getSucursal() != null ? usuario.getSucursal().getNombre() : "Central",
            permisos
        );
    }
}
