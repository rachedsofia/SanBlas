package com.sanblas.application.usecase;

import com.sanblas.application.dto.request.VentaRequest;
import com.sanblas.application.dto.response.VentaResponse;
import com.sanblas.domain.exception.*;
import com.sanblas.infrastructure.persistence.entity.*;
import com.sanblas.infrastructure.persistence.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class VentaUseCase {

    private final VentaJpaRepository ventaRepo;
    private final StockJpaRepository stockRepo;
    private final ProductoJpaRepository productoRepo;
    private final UsuarioJpaRepository usuarioRepo;

    @Transactional
    public VentaResponse crearVenta(VentaRequest req, String emailCajero) {
        var cajero = usuarioRepo.findByEmail(emailCajero)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));

        // Construir detalles y validar stock
        List<DetalleVentaEntity> detalles = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (var item : req.detalles()) {
            var producto = productoRepo.findById(item.productoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto", item.productoId()));

            var stock = stockRepo.findByProductoIdAndSucursalId(item.productoId(), req.sucursalId())
                .orElseThrow(() -> new BusinessException("Sin stock registrado para: " + producto.getNombre()));

            if (stock.getCantidad().compareTo(item.cantidad()) < 0)
                throw new BusinessException("Stock insuficiente para: " + producto.getNombre() +
                    ". Disponible: " + stock.getCantidad());

            BigDecimal descPct = item.descuentoPct() != null ? item.descuentoPct() : BigDecimal.ZERO;
            BigDecimal precioFinal = producto.getPrecioVenta().multiply(
                BigDecimal.ONE.subtract(descPct.divide(BigDecimal.valueOf(100))));
            BigDecimal itemSubtotal = precioFinal.multiply(item.cantidad());
            subtotal = subtotal.add(itemSubtotal);

            detalles.add(DetalleVentaEntity.builder()
                .producto(producto)
                .cantidad(item.cantidad())
                .precioUnitario(producto.getPrecioVenta())
                .precioCosto(producto.getPrecioCosto())
                .descuentoPct(descPct)
                .subtotal(itemSubtotal.setScale(2, java.math.RoundingMode.HALF_UP))
                .build());

            // Descontar stock
            stock.setCantidad(stock.getCantidad().subtract(item.cantidad()));
            stockRepo.save(stock);
        }

        String ticket = "TK-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) +
            "-" + String.format("%04d", (int)(Math.random() * 9999));

        var venta = VentaEntity.builder()
            .sucursal(new SucursalEntity(req.sucursalId(), null, null, null, true, null))
            .usuario(cajero)
            .numeroTicket(ticket)
            .estado(VentaEntity.EstadoVenta.COMPLETADA)
            .subtotal(subtotal.setScale(2, java.math.RoundingMode.HALF_UP))
            .descuentoTotal(BigDecimal.ZERO)
            .total(subtotal.setScale(2, java.math.RoundingMode.HALF_UP))
            .metodoPago(VentaEntity.MetodoPago.valueOf(req.metodoPago()))
            .montoRecibido(req.montoRecibido())
            .vuelto(req.montoRecibido() != null ? req.montoRecibido().subtract(subtotal) : null)
            .observaciones(req.observaciones())
            .build();

        var saved = ventaRepo.save(venta);
        detalles.forEach(d -> { d.setVenta(saved); });
        saved.setDetalles(detalles);
        ventaRepo.save(saved);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<VentaResponse> getVentasByFecha(Long sucursalId, LocalDateTime desde, LocalDateTime hasta) {
        return ventaRepo.findBySucursalAndFecha(sucursalId, desde, hasta)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private VentaResponse toResponse(VentaEntity v) {
        List<VentaResponse.DetalleResponse> det = v.getDetalles() == null ? List.of() :
            v.getDetalles().stream().map(d -> new VentaResponse.DetalleResponse(
                d.getProducto().getId(), d.getProducto().getNombre(),
                d.getProducto().getCodigoBarras(),
                d.getCantidad(), d.getPrecioUnitario(), d.getDescuentoPct(), d.getSubtotal()
            )).collect(Collectors.toList());

        return new VentaResponse(
            v.getId(), v.getNumeroTicket(), v.getEstado().name(),
            v.getSucursal() != null ? v.getSucursal().getNombre() : "",
            v.getUsuario().getNombre() + " " + v.getUsuario().getApellido(),
            v.getSubtotal(), v.getDescuentoTotal(), v.getTotal(),
            v.getMetodoPago().name(), v.getMontoRecibido(), v.getVuelto(),
            v.getCreatedAt(), det
        );
    }
}
