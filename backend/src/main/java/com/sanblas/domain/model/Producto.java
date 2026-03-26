package com.sanblas.domain.model;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Producto {
    private Long id;
    private Long categoriaId;
    private String categoriaNombre;
    private Long proveedorId;
    private String proveedorNombre;
    private String codigoBarras;
    private String sku;
    private String nombre;
    private String descripcion;
    private BigDecimal precioCosto;
    private BigDecimal precioVenta;
    private BigDecimal margenPct;
    private String unidadMedida;
    private String imagenUrl;
    private Boolean activo;
    private LocalDateTime createdAt;
}
