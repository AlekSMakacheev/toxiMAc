package ru.mas.toximas.dto.toxicometry;

public record ToxicometryResponseDto(
        Double d16,
        Double d50,
        Double d84,
        Double d50Error,
        Double a,
        Double b

) {}
