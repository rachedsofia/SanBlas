package com.sanblas.application.dto.response;
public record AuthResponse(
    String token,
    String email,
    String nombreCompleto,
    String rol,
    Long sucursalId,
    String sucursalNombre,
    java.util.Set<String> permisos
) {}
