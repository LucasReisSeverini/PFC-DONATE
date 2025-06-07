package com.donate.backend.main.repository;

import com.donate.backend.main.domain.BancoLeiteModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Map;

public interface BancoLeiteRepository extends JpaRepository<BancoLeiteModel, Long> {

    @Query(value = """
    SELECT *, (
        6371 * acos(
            cos(radians(:latitude)) *
            cos(radians(b.latitude)) *
            cos(radians(b.longitude) - radians(:longitude)) +
            sin(radians(:latitude)) *
            sin(radians(b.latitude))
        )
    ) AS distancia
    FROM bancos_de_leite b
    ORDER BY distancia ASC
    LIMIT 1
    """, nativeQuery = true)
    Map<String, Object> buscarMaisProximo(@Param("latitude") double latitude,
                                          @Param("longitude") double longitude);
}