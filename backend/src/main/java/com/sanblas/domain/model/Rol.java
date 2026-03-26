package com.sanblas.domain.model;

import lombok.*;
import java.util.Set;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Rol {
    private Long id;
    private String nombre;
    private String descripcion;
    private Set<String> permisos;
}
