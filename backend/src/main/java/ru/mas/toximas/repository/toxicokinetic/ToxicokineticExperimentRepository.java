package ru.mas.toximas.repository.toxicokinetic;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.mas.toximas.entity.toxicokinetic.ToxicokineticExperiment;

import java.util.List;

@Repository
public interface ToxicokineticExperimentRepository extends JpaRepository<ToxicokineticExperiment, Long> {

  List<ToxicokineticExperiment> findAllByOrderByCreatedAtDesc();

  List<ToxicokineticExperiment> findBySubstanceContainingIgnoreCase(String substance);
}
