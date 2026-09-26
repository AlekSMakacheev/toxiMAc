package ru.mas.toximas.dto;

import java.util.List;

public record ToxicometryRequestDto(
        List<GroupDto> groups
) {}
