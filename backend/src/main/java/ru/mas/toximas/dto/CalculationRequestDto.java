package ru.mas.toximas.dto;

import java.util.List;

// Это сам запрос от фронтенда. В нем прилетит введенная доза и целый список наших точек.
//
// ВАЖНО (единицы):
//   dose  — в мг
//   points — time в минутах, concentration в мкг/мл (= мг/л)
//

public record CalculationRequestDto(
        double dose,
        List<PointDto> points
) {}
