package ru.mas.toximas.dto.toxicokinetic;

import ru.mas.toximas.dto.core.PointDto;

import java.util.List;

public record ToxicokineticExperimentRequestDto(
        String name,
        String substance,
        Double dose,
        String route,
        String notes,
        List<PointDto> points
) {}
