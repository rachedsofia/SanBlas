package com.sanblas.domain.model;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Stock {
    private Long id;
    private Long productoId;
    private String productoNombre;
    private String codigoBarras;
    private Long sucursalId;
    private String sucursalNombre;
    private BigDecimal cantidad;
    private BigDecimal stockMinimo;
    private BigDecimal stockMaximo;
    private String ubicacion;
    private LocalDateTime updatedAt;

    public boolean estaBajoMinimo() {
        return cantidad.compareTo(stockMinimo) <= 0;
    }
}
