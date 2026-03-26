package com.sanblas.infrastructure.web.controller;

import com.sanblas.application.dto.request.VentaRequest;
import com.sanblas.application.dto.response.VentaResponse;
import com.sanblas.application.usecase.VentaUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController @RequestMapping("/api/pos") @RequiredArgsConstructor
public class VentaController {
    private final VentaUseCase ventaUseCase;

    @PostMapping("/ventas")
    public ResponseEntity<VentaResponse> crearVenta(
            @Valid @RequestBody VentaRequest req,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(ventaUseCase.crearVenta(req, user.getUsername()));
    }

    @GetMapping("/ventas")
    public ResponseEntity<List<VentaResponse>> getVentas(
            @RequestParam Long sucursalId,
            @RequestParam @DateTimeFormat(iso=DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso=DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        return ResponseEntity.ok(ventaUseCase.getVentasByFecha(sucursalId, desde, hasta));
    }
}
