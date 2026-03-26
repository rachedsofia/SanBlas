package com.sanblas.infrastructure.persistence.repository;

import com.sanblas.infrastructure.persistence.entity.StockEntity;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface StockJpaRepository extends JpaRepository<StockEntity, Long> {
    Optional<StockEntity> findByProductoIdAndSucursalId(Long productoId, Long sucursalId);
    List<StockEntity> findBySucursalId(Long sucursalId);

    @Query("SELECT s FROM StockEntity s WHERE s.sucursal.id = :sucId AND s.cantidad <= s.stockMinimo")
    List<StockEntity> findBajoMinimoBySucursal(@Param("sucId") Long sucursalId);

    @Query("SELECT s FROM StockEntity s WHERE s.cantidad <= s.stockMinimo")
    List<StockEntity> findAllBajoMinimo();
}
