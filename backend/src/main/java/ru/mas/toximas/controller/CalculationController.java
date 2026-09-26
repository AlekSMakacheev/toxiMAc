package ru.mas.toximas.controller;

import org.springframework.web.bind.annotation.*;
import ru.mas.toximas.dto.CalculationRequestDto;
import ru.mas.toximas.dto.CalculationResponseDto;
import ru.mas.toximas.service.CalculationService;

@RestController
@RequestMapping("/api/calculate")
@CrossOrigin(origins = "http://localhost:5173") // Разрешаем запросы от нашего React-приложения
public class CalculationController {

  private final CalculationService calculationService;

  // Внедряем сервис через конструктор (Spring сделает это автоматически)
  public CalculationController(CalculationService calculationService) {
    this.calculationService = calculationService;
  }

  @PostMapping("/toxicokinetics")
  public CalculationResponseDto calculateToxicokinetics(@RequestBody CalculationRequestDto request) {
    // Передаем данные в сервис и сразу возвращаем результат
    return calculationService.calculateAll(request);
  }
}