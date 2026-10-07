package ru.mas.toximas.dto.core;

public record GroupResponseDto(
        Long id,
        Double dose,
        Integer total,
        Integer effect
) {}
