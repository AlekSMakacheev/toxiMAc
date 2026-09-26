package ru.mas.toximas.controller;

import org.springframework.web.bind.annotation.*;
import ru.mas.toximas.dto.ToxicometryRequestDto;
import ru.mas.toximas.dto.ToxicometryResponseDto;
import ru.mas.toximas.service.ToxicometryService;

@RestController
@RequestMapping("/api/toxicometry")
@CrossOrigin(origins = "http://localhost:5173") // Разрешаем запросы от твоего React-приложения
public class ToxicometryController {

  private final ToxicometryService toxicometryService;

  // Внедрение зависимости через конструктор (лучшая практика Spring)
  public ToxicometryController(ToxicometryService toxicometryService) {
    this.toxicometryService = toxicometryService;
  }

  @PostMapping("/calculate")
  public ToxicometryResponseDto calculate(@RequestBody ToxicometryRequestDto request) {
    return toxicometryService.calculateLethalDoses(request);
  }
}
