package com.sanblas.infrastructure.persistence.repository;

import com.sanblas.infrastructure.persistence.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import java.util.List;

public interface UsuarioJpaRepository extends JpaRepository<UsuarioEntity, Long> {
    Optional<UsuarioEntity> findByEmail(String email);
    List<UsuarioEntity> findBySucursalId(Long sucursalId);
    boolean existsByEmail(String email);
    boolean existsByDni(String dni);
}
