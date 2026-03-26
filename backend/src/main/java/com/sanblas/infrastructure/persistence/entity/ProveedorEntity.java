package com.sanblas.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "proveedores")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProveedorEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "razon_social", nullable = false, length = 150) private String razonSocial;
    @Column(unique = true, length = 20) private String cuit;
    @Column(length = 150) private String email;
    @Column(length = 20)  private String telefono;
    @Column(length = 255) private String direccion;
    @Column(name = "contacto_nombre", length = 100) private String contactoNombre;
    @Column(nullable = false) private Boolean activo = true;
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @PrePersist void prePersist() { if (createdAt == null) createdAt = LocalDateTime.now(); }
}
