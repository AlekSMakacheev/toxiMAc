package ru.mas.toximas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.mas.toximas.entity.Substance;

import java.util.Optional;

@Repository
public interface SubstanceRepository extends JpaRepository<Substance, Long> {

  Optional<Substance> findByNameIgnoreCase(String name);
}
