package com.sanblas.infrastructure.persistence.repository;

import com.sanblas.infrastructure.persistence.entity.ProductoEntity;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface ProductoJpaRepository extends JpaRepository<ProductoEntity, Long> {
    Optional<ProductoEntity> findByCodigoBarras(String codigoBarras);
    Optional<ProductoEntity> findBySku(String sku);
    List<ProductoEntity> findByActivoTrue();
    List<ProductoEntity> findByCategoriaIdAndActivoTrue(Long categoriaId);

    @Query("SELECT p FROM ProductoEntity p WHERE p.activo = true AND " +
           "(LOWER(p.nombre) LIKE LOWER(CONCAT('%',:q,'%')) OR p.codigoBarras LIKE CONCAT('%',:q,'%'))")
    List<ProductoEntity> search(@Param("q") String query);
}
