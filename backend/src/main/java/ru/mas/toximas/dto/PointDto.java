package ru.mas.toximas.dto;

//Этот класс будет принимать каждую отдельную точку с графика (время и концентрацию)
public record PointDto(
        double time,
        double concentration
) {}
