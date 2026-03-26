package com.sanblas.infrastructure.web.controller;

import com.sanblas.application.dto.request.StockAjusteRequest;
import com.sanblas.infrastructure.persistence.entity.StockEntity;
import com.sanblas.infrastructure.persistence.repository.StockJpaRepository;
import com.sanblas.infrastructure.persistence.repository.ProductoJpaRepository;
import com.sanblas.domain.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController @RequestMapping("/api/stock") @RequiredArgsConstructor
public class StockController {
    private final StockJpaRepository stockRepo;
    private final ProductoJpaRepository productoRepo;

    @GetMapping("/sucursal/{sucursalId}")
    public ResponseEntity<List<StockEntity>> getBySucursal(@PathVariable Long sucursalId) {
        return ResponseEntity.ok(stockRepo.findBySucursalId(sucursalId));
    }

    @GetMapping("/alertas")
    public ResponseEntity<List<StockEntity>> getAlertas() {
        return ResponseEntity.ok(stockRepo.findAllBajoMinimo());
    }

    @GetMapping("/alertas/sucursal/{sucursalId}")
    public ResponseEntity<List<StockEntity>> getAlertasBySucursal(@PathVariable Long sucursalId) {
        return ResponseEntity.ok(stockRepo.findBajoMinimoBySucursal(sucursalId));
    }

    @GetMapping("/barras/{codigo}")
    public ResponseEntity<?> getByCodigoBarras(@PathVariable String codigo) {
        var producto = productoRepo.findByCodigoBarras(codigo)
            .orElseThrow(() -> new ResourceNotFoundException("Producto con código " + codigo + " no encontrado"));
        return ResponseEntity.ok(producto);
    }

    @PostMapping("/ajuste")
    public ResponseEntity<Map<String, String>> ajustar(@Valid @RequestBody StockAjusteRequest req) {
        var stock = stockRepo.findByProductoIdAndSucursalId(req.productoId(), req.sucursalId())
            .orElseThrow(() -> new ResourceNotFoundException("Stock no encontrado"));
        switch (req.tipo()) {
            case "ENTRADA" -> stock.setCantidad(stock.getCantidad().add(req.cantidad()));
            case "SALIDA"  -> stock.setCantidad(stock.getCantidad().subtract(req.cantidad()));
            case "AJUSTE"  -> stock.setCantidad(req.cantidad());
            default -> throw new com.sanblas.domain.exception.BusinessException("Tipo de movimiento inválido: " + req.tipo());
        }
        if (stock.getCantidad().compareTo(BigDecimal.ZERO) < 0)
            throw new com.sanblas.domain.exception.BusinessException("Stock no puede quedar negativo");
        stockRepo.save(stock);
        return ResponseEntity.ok(Map.of("message", "Stock actualizado correctamente"));
    }
}
