package com.sanblas.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "categorias_producto")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CategoriaProductoEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100) private String nombre;
    @Column(length = 255) private String descripcion;
    @Column(nullable = false) private Boolean activo = true;
}
