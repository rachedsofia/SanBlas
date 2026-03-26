package com.sanblas.application.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;
public record VentaRequest(
    @NotNull Long sucursalId,
    @NotBlank String metodoPago,
    BigDecimal montoRecibido,
    String observaciones,
    @NotEmpty List<DetalleRequest> detalles
) {
    public record DetalleRequest(
        @NotNull Long productoId,
        @NotNull @Positive BigDecimal cantidad,
        @DecimalMin("0") BigDecimal descuentoPct
    ) {}
}
