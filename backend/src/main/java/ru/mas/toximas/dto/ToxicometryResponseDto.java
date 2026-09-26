package ru.mas.toximas.dto;

public record ToxicometryResponseDto(
        Double ld16,
        Double ld50,
        Double ld84,
        Double ld50Error, // Добавили стандартную ошибку
        Double a, // Коэффициент A прямой регрессии
        Double b  // Коэффициент B прямой регресси

) {}
