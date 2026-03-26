package com.sanblas.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "permisos")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PermisoEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 100) private String codigo;
    @Column(length = 255) private String descripcion;
}
