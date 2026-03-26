package com.sanblas.infrastructure.web.controller;

import com.sanblas.infrastructure.persistence.entity.ProductoEntity;
import com.sanblas.infrastructure.persistence.repository.ProductoJpaRepository;
import com.sanblas.domain.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @RequestMapping("/api/productos") @RequiredArgsConstructor
public class ProductoController {
    private final ProductoJpaRepository productoRepo;

    @GetMapping
    public ResponseEntity<List<ProductoEntity>> getAll() {
        return ResponseEntity.ok(productoRepo.findByActivoTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoEntity> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productoRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Producto", id)));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProductoEntity>> search(@RequestParam String q) {
        return ResponseEntity.ok(productoRepo.search(q));
    }

    @PostMapping
    public ResponseEntity<ProductoEntity> crear(@RequestBody ProductoEntity producto) {
        producto.setId(null);
        return ResponseEntity.status(201).body(productoRepo.save(producto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoEntity> actualizar(@PathVariable Long id, @RequestBody ProductoEntity data) {
        var existing = productoRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
        data.setId(id);
        data.setCreatedAt(existing.getCreatedAt());
        return ResponseEntity.ok(productoRepo.save(data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        var p = productoRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Producto", id));
        p.setActivo(false);
        productoRepo.save(p);
        return ResponseEntity.noContent().build();
    }
}
