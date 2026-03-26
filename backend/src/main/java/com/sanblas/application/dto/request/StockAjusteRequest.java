package com.sanblas.application.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record StockAjusteRequest(
    @NotNull Long productoId,
    @NotNull Long sucursalId,
    @NotNull BigDecimal cantidad,
    @NotBlank String tipo,
    String motivo
) {}
