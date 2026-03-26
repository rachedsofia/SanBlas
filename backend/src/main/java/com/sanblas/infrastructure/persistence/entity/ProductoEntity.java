package com.sanblas.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "productos")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductoEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "categoria_id") private CategoriaProductoEntity categoria;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "proveedor_id") private ProveedorEntity proveedor;
    @Column(name = "codigo_barras", unique = true, length = 50) private String codigoBarras;
    @Column(unique = true, length = 50) private String sku;
    @Column(nullable = false, length = 200) private String nombre;
    @Column(columnDefinition = "TEXT") private String descripcion;
    @Column(name = "precio_costo", nullable = false, precision = 10, scale = 2) private BigDecimal precioCosto;
    @Column(name = "precio_venta", nullable = false, precision = 10, scale = 2) private BigDecimal precioVenta;
    @Column(name = "margen_pct", insertable = false, updatable = false, precision = 5, scale = 2) private BigDecimal margenPct;
    @Column(name = "unidad_medida", length = 20) @Enumerated(EnumType.STRING) private UnidadMedida unidadMedida = UnidadMedida.UNIDAD;
    @Column(name = "imagen_url") private String imagenUrl;
    @Column(nullable = false) private Boolean activo = true;
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
    @PrePersist void prePersist() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate  void preUpdate()  { updatedAt = LocalDateTime.now(); }

    public enum UnidadMedida { UNIDAD, KG, GR, LT, ML, CAJA, PACK }
}
