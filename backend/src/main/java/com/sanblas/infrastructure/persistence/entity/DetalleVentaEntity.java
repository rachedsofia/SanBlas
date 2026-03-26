package com.sanblas.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity @Table(name = "detalle_ventas")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DetalleVentaEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "venta_id", nullable = false)    private VentaEntity venta;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "producto_id", nullable = false) private ProductoEntity producto;
    @Column(nullable = false, precision = 10, scale = 3) private BigDecimal cantidad;
    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2) private BigDecimal precioUnitario;
    @Column(name = "precio_costo", nullable = false, precision = 10, scale = 2)   private BigDecimal precioCosto;
    @Column(name = "descuento_pct", precision = 5, scale = 2)                     private BigDecimal descuentoPct = BigDecimal.ZERO;
    @Column(nullable = false, precision = 10, scale = 2)                          private BigDecimal subtotal;
}
