package ru.mas.toximas.dto.toxicokinetic;

import ru.mas.toximas.dto.core.PointResponseDto;

import java.time.LocalDateTime;
import java.util.List;

public record ToxicokineticExperimentResponseDto(
        Long id,
        String name,
        String substance,
        Double dose,
        String route,
        String notes,
        LocalDateTime createdAt,
        List<PointResponseDto> points
) {}