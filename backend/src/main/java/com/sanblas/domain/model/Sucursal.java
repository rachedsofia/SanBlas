package com.sanblas.domain.model;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Sucursal {
    private Long id;
    private String nombre;
    private String direccion;
    private String telefono;
    private Boolean activo;
    private LocalDateTime createdAt;
}
