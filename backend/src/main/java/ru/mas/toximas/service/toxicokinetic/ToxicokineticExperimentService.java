package ru.mas.toximas.service.toxicokinetic;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mas.toximas.dto.toxicokinetic.ToxicokineticExperimentRequestDto;
import ru.mas.toximas.dto.toxicokinetic.ToxicokineticExperimentResponseDto;
import ru.mas.toximas.entity.toxicokinetic.ToxicokineticExperiment;
import ru.mas.toximas.entity.toxicokinetic.ToxicokineticPoint;
import ru.mas.toximas.repository.toxicokinetic.ToxicokineticExperimentRepository;
import ru.mas.toximas.dto.core.PointResponseDto;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ToxicokineticExperimentService {

  private final ToxicokineticExperimentRepository repository;

  public ToxicokineticExperimentService(ToxicokineticExperimentRepository repository) {
    this.repository = repository;
  }

  @Transactional
  public ToxicokineticExperimentResponseDto create(ToxicokineticExperimentRequestDto request) {
    ToxicokineticExperiment experiment = new ToxicokineticExperiment();
    experiment.setName(request.name());
    experiment.setSubstance(request.substance());
    experiment.setDose(request.dose());
    experiment.setRoute(request.route());
    experiment.setNotes(request.notes());

    if (request.points() != null) {
      List<ToxicokineticPoint> points = request.points().stream()
              .map(p -> {
                ToxicokineticPoint point = new ToxicokineticPoint();
                point.setTime(p.time());
                point.setConcentration(p.concentration());
                point.setExperiment(experiment);
                return point;
              })
              .collect(Collectors.toList());
      experiment.setPoints(points);
    }

    ToxicokineticExperiment saved = repository.save(experiment);
    return toResponse(saved);
  }

  @Transactional(readOnly = true)
  public List<ToxicokineticExperimentResponseDto> getAll() {
    return repository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public ToxicokineticExperimentResponseDto getById(Long id) {
    ToxicokineticExperiment experiment = repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Toxicokinetic experiment not found: " + id));
    return toResponse(experiment);
  }

  @Transactional
  public void delete(Long id) {
    if (!repository.existsById(id)) {
      throw new IllegalArgumentException("Toxicokinetic experiment not found: " + id);
    }
    repository.deleteById(id);
  }

  private ToxicokineticExperimentResponseDto toResponse(ToxicokineticExperiment e) {
    List<PointResponseDto> points = e.getPoints().stream()
            .map(p -> new PointResponseDto(
                    p.getId(), p.getTime(), p.getConcentration()
            ))
            .collect(Collectors.toList());

    return new ToxicokineticExperimentResponseDto(
            e.getId(),
            e.getName(),
            e.getSubstance(),
            e.getDose(),
            e.getRoute(),
            e.getNotes(),
            e.getCreatedAt(),
            points
    );
  }
}