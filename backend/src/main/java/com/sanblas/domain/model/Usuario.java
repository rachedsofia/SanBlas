package com.sanblas.domain.model;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Usuario {
    private Long id;
    private Long sucursalId;
    private String sucursalNombre;
    private Long rolId;
    private String rolNombre;
    private String nombre;
    private String apellido;
    private String email;
    private String passwordHash;
    private String dni;
    private String telefono;
    private Boolean activo;
    private LocalDateTime ultimoLogin;
    private LocalDateTime createdAt;
}
