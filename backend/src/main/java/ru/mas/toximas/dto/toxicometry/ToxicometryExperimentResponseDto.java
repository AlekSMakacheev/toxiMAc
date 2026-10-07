package ru.mas.toximas.dto.toxicometry;

import ru.mas.toximas.dto.core.GroupResponseDto;

import java.time.LocalDateTime;
import java.util.List;

public record ToxicometryExperimentResponseDto(
        Long id,
        String name,
        String substance,
        String species,
        String notes,
        LocalDateTime createdAt,
        List<GroupResponseDto> groups
) {}