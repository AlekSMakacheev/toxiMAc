package ru.mas.toximas.dto.toxicometry;

import ru.mas.toximas.dto.core.GroupDto;

import java.util.List;

public record ToxicometryExperimentRequestDto(
        String name,
        String substance,
        String species,
        String notes,
        List<GroupDto> groups
) {}