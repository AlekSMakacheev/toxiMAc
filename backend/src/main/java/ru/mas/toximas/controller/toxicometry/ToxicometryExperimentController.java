package ru.mas.toximas.controller.toxicometry;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mas.toximas.dto.toxicometry.ToxicometryExperimentRequestDto;
import ru.mas.toximas.dto.toxicometry.ToxicometryExperimentResponseDto;
import ru.mas.toximas.service.toxicometry.ToxicometryExperimentService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/toxicometry-experiments")
@CrossOrigin(origins = "http://localhost:5173")
public class ToxicometryExperimentController {

  private final ToxicometryExperimentService service;

  public ToxicometryExperimentController(ToxicometryExperimentService service) {
    this.service = service;
  }

  @PostMapping
  public ResponseEntity<ToxicometryExperimentResponseDto> create(
          @RequestBody ToxicometryExperimentRequestDto request) {
    ToxicometryExperimentResponseDto created = service.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @GetMapping
  public List<ToxicometryExperimentResponseDto> getAll() {
    return service.getAll();
  }

  @GetMapping("/{id}")
  public ToxicometryExperimentResponseDto getById(@PathVariable Long id) {
    return service.getById(id);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}