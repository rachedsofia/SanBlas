package com.sanblas.infrastructure.persistence.repository;

import com.sanblas.infrastructure.persistence.entity.VentaEntity;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface VentaJpaRepository extends JpaRepository<VentaEntity, Long> {

    @Query("SELECT v FROM VentaEntity v WHERE v.sucursal.id = :sucId AND v.createdAt BETWEEN :desde AND :hasta AND v.estado = 'COMPLETADA'")
    List<VentaEntity> findBySucursalAndFecha(@Param("sucId") Long sucursalId, @Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta);

    @Query("SELECT SUM(v.total) FROM VentaEntity v WHERE v.createdAt BETWEEN :desde AND :hasta AND v.estado = 'COMPLETADA'")
    BigDecimal sumTotalByFecha(@Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta);

    @Query("SELECT v.sucursal.nombre, SUM(v.total), COUNT(v) FROM VentaEntity v WHERE v.estado = 'COMPLETADA' AND v.createdAt BETWEEN :desde AND :hasta GROUP BY v.sucursal.id ORDER BY SUM(v.total) DESC")
    List<Object[]> ventasPorSucursal(@Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta);

    @Query("SELECT dv.producto.id, dv.producto.nombre, SUM(dv.cantidad), SUM(dv.subtotal) FROM DetalleVentaEntity dv JOIN dv.venta v WHERE v.estado = 'COMPLETADA' AND v.createdAt BETWEEN :desde AND :hasta GROUP BY dv.producto.id ORDER BY SUM(dv.cantidad) DESC")
    List<Object[]> rankingProductos(@Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta);

    @Query("SELECT v.usuario.id, v.usuario.nombre, v.usuario.apellido, COUNT(v), SUM(v.total) FROM VentaEntity v WHERE v.estado = 'COMPLETADA' AND v.createdAt BETWEEN :desde AND :hasta GROUP BY v.usuario.id ORDER BY SUM(v.total) DESC")
    List<Object[]> rankingEmpleados(@Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta);
}
