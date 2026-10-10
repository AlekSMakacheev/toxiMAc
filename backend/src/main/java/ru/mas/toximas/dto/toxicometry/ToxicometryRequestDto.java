package ru.mas.toximas.dto.toxicometry;

import ru.mas.toximas.dto.core.GroupDto;

import java.util.List;

public record ToxicometryRequestDto(
        List<GroupDto> groups
) {}
