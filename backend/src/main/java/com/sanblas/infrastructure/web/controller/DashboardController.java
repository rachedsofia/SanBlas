package com.sanblas.infrastructure.web.controller;

import com.sanblas.infrastructure.persistence.repository.VentaJpaRepository;
import com.sanblas.infrastructure.persistence.repository.StockJpaRepository;
import com.sanblas.infrastructure.persistence.repository.UsuarioJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController @RequestMapping("/api/reportes") @RequiredArgsConstructor
public class DashboardController {

    private final VentaJpaRepository ventaRepo;
    private final StockJpaRepository stockRepo;

    @GetMapping("/kpi")
    public ResponseEntity<Map<String, Object>> getKpi() {
        var hoy = LocalDate.now();
        var inicioHoy = hoy.atStartOfDay();
        var finHoy = hoy.atTime(LocalTime.MAX);
        var inicioMes = hoy.withDayOfMonth(1).atStartOfDay();
        var finMes = hoy.atTime(LocalTime.MAX);

        BigDecimal totalHoy = Optional.ofNullable(ventaRepo.sumTotalByFecha(inicioHoy, finHoy)).orElse(BigDecimal.ZERO);
        BigDecimal totalMes = Optional.ofNullable(ventaRepo.sumTotalByFecha(inicioMes, finMes)).orElse(BigDecimal.ZERO);
        long alertasStock = stockRepo.findAllBajoMinimo().size();

        return ResponseEntity.ok(Map.of(
            "ventasHoy", totalHoy,
            "ventasMes", totalMes,
            "alertasStock", alertasStock
        ));
    }

    @GetMapping("/ventas-por-sucursal")
    public ResponseEntity<List<Map<String, Object>>> ventasPorSucursal(
            @RequestParam(defaultValue = "30") int dias) {
        var desde = LocalDate.now().minusDays(dias).atStartOfDay();
        var hasta = LocalDateTime.now();
        return ResponseEntity.ok(
            ventaRepo.ventasPorSucursal(desde, hasta).stream().map(row ->
                Map.<String, Object>of(
                    "sucursal", row[0],
                    "total", row[1],
                    "cantidad", row[2]
                )
            ).collect(Collectors.toList())
        );
    }

    @GetMapping("/ranking-productos")
    public ResponseEntity<List<Map<String, Object>>> rankingProductos(
            @RequestParam(defaultValue = "30") int dias) {
        var desde = LocalDate.now().minusDays(dias).atStartOfDay();
        var hasta = LocalDateTime.now();
        return ResponseEntity.ok(
            ventaRepo.rankingProductos(desde, hasta).stream().limit(20).map(row ->
                Map.<String, Object>of(
                    "productoId", row[0],
                    "nombre", row[1],
                    "unidades", row[2],
                    "ingresos", row[3]
                )
            ).collect(Collectors.toList())
        );
    }

    @GetMapping("/ranking-empleados")
    public ResponseEntity<List<Map<String, Object>>> rankingEmpleados(
            @RequestParam(defaultValue = "30") int dias) {
        var desde = LocalDate.now().minusDays(dias).atStartOfDay();
        var hasta = LocalDateTime.now();
        return ResponseEntity.ok(
            ventaRepo.rankingEmpleados(desde, hasta).stream().map(row ->
                Map.<String, Object>of(
                    "empleadoId", row[0],
                    "nombre", row[1] + " " + row[2],
                    "ventas", row[3],
                    "total", row[4]
                )
            ).collect(Collectors.toList())
        );
    }
}
