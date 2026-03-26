package com.sanblas.application.dto.response;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public record VentaResponse(
    Long id, String numeroTicket, String estado,
    String sucursal, String cajero,
    BigDecimal subtotal, BigDecimal descuentoTotal, BigDecimal total,
    String metodoPago, BigDecimal montoRecibido, BigDecimal vuelto,
    LocalDateTime fecha,
    List<DetalleResponse> detalles
) {
    public record DetalleResponse(
        Long productoId, String productoNombre, String codigoBarras,
        BigDecimal cantidad, BigDecimal precioUnitario,
        BigDecimal descuentoPct, BigDecimal subtotal
    ) {}
}
