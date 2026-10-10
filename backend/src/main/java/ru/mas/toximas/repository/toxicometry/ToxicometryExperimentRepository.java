package ru.mas.toximas.repository.toxicometry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.mas.toximas.entity.toxicometry.ToxicometryExperiment;

import java.util.List;

@Repository
public interface ToxicometryExperimentRepository extends JpaRepository<ToxicometryExperiment, Long> {

  List<ToxicometryExperiment> findAllByOrderByCreatedAtDesc();

  List<ToxicometryExperiment> findBySubstanceContainingIgnoreCase(String substance);
}