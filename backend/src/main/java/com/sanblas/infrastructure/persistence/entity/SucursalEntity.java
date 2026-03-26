package com.sanblas.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "sucursales")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SucursalEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100) private String nombre;
    @Column(nullable = false)               private String direccion;
    @Column(length = 20)                    private String telefono;
    @Column(nullable = false)               private Boolean activo = true;
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @PrePersist void prePersist() { if (createdAt == null) createdAt = LocalDateTime.now(); }
}
