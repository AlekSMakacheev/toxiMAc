package ru.mas.toximas.service.toxicometry;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mas.toximas.dto.toxicometry.ToxicometryExperimentRequestDto;
import ru.mas.toximas.dto.toxicometry.ToxicometryExperimentResponseDto;
import ru.mas.toximas.entity.toxicometry.ToxicometryExperiment;
import ru.mas.toximas.entity.toxicometry.ToxicometryGroup;
import ru.mas.toximas.repository.toxicometry.ToxicometryExperimentRepository;
import ru.mas.toximas.dto.core.GroupResponseDto;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ToxicometryExperimentService {

  private final ToxicometryExperimentRepository repository;

  public ToxicometryExperimentService(ToxicometryExperimentRepository repository) {
    this.repository = repository;
  }

  @Transactional
  public ToxicometryExperimentResponseDto create(ToxicometryExperimentRequestDto request) {
    ToxicometryExperiment experiment = new ToxicometryExperiment();
    experiment.setName(request.name());
    experiment.setSubstance(request.substance());
    experiment.setSpecies(request.species());
    experiment.setNotes(request.notes());

    if (request.groups() != null) {
      List<ToxicometryGroup> groups = request.groups().stream()
              .map(g -> {
                ToxicometryGroup group = new ToxicometryGroup();
                group.setDose(g.dose());
                group.setTotal(g.total());
                group.setEffect(g.effect());
                group.setExperiment(experiment);
                return group;
              })
              .collect(Collectors.toList());
      experiment.setGroups(groups);
    }

    ToxicometryExperiment saved = repository.save(experiment);
    return toResponse(saved);
  }

  @Transactional(readOnly = true)
  public List<ToxicometryExperimentResponseDto> getAll() {
    return repository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public ToxicometryExperimentResponseDto getById(Long id) {
    ToxicometryExperiment experiment = repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Toxicometry experiment not found: " + id));
    return toResponse(experiment);
  }

  @Transactional
  public void delete(Long id) {
    if (!repository.existsById(id)) {
      throw new IllegalArgumentException("Toxicometry experiment not found: " + id);
    }
    repository.deleteById(id);
  }

  private ToxicometryExperimentResponseDto toResponse(ToxicometryExperiment e) {
    List<GroupResponseDto> groups = e.getGroups().stream()
            .map(g -> new GroupResponseDto(
                    g.getId(), g.getDose(), g.getTotal(), g.getEffect()
            ))
            .collect(Collectors.toList());

    return new ToxicometryExperimentResponseDto(
            e.getId(),
            e.getName(),
            e.getSubstance(),
            e.getSpecies(),
            e.getNotes(),
            e.getCreatedAt(),
            groups
    );
  }
}
