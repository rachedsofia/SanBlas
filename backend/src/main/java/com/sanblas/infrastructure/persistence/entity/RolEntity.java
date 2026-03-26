package com.sanblas.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity @Table(name = "roles")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RolEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 50) private String nombre;
    @Column(length = 255) private String descripcion;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "roles_permisos",
        joinColumns = @JoinColumn(name = "rol_id"),
        inverseJoinColumns = @JoinColumn(name = "permiso_id"))
    private Set<PermisoEntity> permisos;
}
