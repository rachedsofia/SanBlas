package com.sanblas.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "stock")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StockEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "producto_id", nullable = false) private ProductoEntity producto;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "sucursal_id", nullable = false) private SucursalEntity sucursal;
    @Column(nullable = false, precision = 10, scale = 3) private BigDecimal cantidad = BigDecimal.ZERO;
    @Column(name = "stock_minimo", nullable = false, precision = 10, scale = 3) private BigDecimal stockMinimo;
    @Column(name = "stock_maximo", nullable = false, precision = 10, scale = 3) private BigDecimal stockMaximo;
    @Column(length = 100) private String ubicacion;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
    @PreUpdate @PrePersist void preUpdate() { updatedAt = LocalDateTime.now(); }
}
