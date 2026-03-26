package com.sanblas.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity @Table(name = "ventas")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class VentaEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "sucursal_id", nullable = false) private SucursalEntity sucursal;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "usuario_id",  nullable = false) private UsuarioEntity usuario;
    @Column(name = "numero_ticket", unique = true, length = 30) private String numeroTicket;
    @Enumerated(EnumType.STRING) @Column(length = 20) private EstadoVenta estado = EstadoVenta.PENDIENTE;
    @Column(precision = 10, scale = 2) private BigDecimal subtotal = BigDecimal.ZERO;
    @Column(name = "descuento_total", precision = 10, scale = 2) private BigDecimal descuentoTotal = BigDecimal.ZERO;
    @Column(precision = 10, scale = 2) private BigDecimal total = BigDecimal.ZERO;
    @Column(name = "metodo_pago", length = 20) @Enumerated(EnumType.STRING) private MetodoPago metodoPago = MetodoPago.EFECTIVO;
    @Column(name = "monto_recibido", precision = 10, scale = 2) private BigDecimal montoRecibido;
    @Column(precision = 10, scale = 2) private BigDecimal vuelto;
    @Column(length = 500) private String observaciones;
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DetalleVentaEntity> detalles;
    @PrePersist void prePersist() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate  void preUpdate()  { updatedAt = LocalDateTime.now(); }

    public enum EstadoVenta { PENDIENTE, COMPLETADA, ANULADA, DEVUELTA }
    public enum MetodoPago  { EFECTIVO, TARJETA_DEBITO, TARJETA_CREDITO, TRANSFERENCIA, QR }
}
