package ru.mas.toximas.controller.toxicokinetic;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mas.toximas.dto.toxicokinetic.ToxicokineticExperimentRequestDto;
import ru.mas.toximas.dto.toxicokinetic.ToxicokineticExperimentResponseDto;
import ru.mas.toximas.service.toxicokinetic.ToxicokineticExperimentService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/toxicokinetic-experiments")
@CrossOrigin(origins = "http://localhost:5173")
public class ToxicokineticExperimentController {

  private final ToxicokineticExperimentService service;

  public ToxicokineticExperimentController(ToxicokineticExperimentService service) {
    this.service = service;
  }

  @PostMapping
  public ResponseEntity<ToxicokineticExperimentResponseDto> create(
          @RequestBody ToxicokineticExperimentRequestDto request) {
    ToxicokineticExperimentResponseDto created = service.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @GetMapping
  public List<ToxicokineticExperimentResponseDto> getAll() {
    return service.getAll();
  }

  @GetMapping("/{id}")
  public ToxicokineticExperimentResponseDto getById(@PathVariable Long id) {
    return service.getById(id);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
