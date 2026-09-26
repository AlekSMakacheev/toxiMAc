package ru.mas.toximas.service;

import org.springframework.stereotype.Service;
import ru.mas.toximas.dto.CalculationRequestDto;
import ru.mas.toximas.dto.CalculationResponseDto;
import ru.mas.toximas.dto.PointDto;

import java.util.List;

@Service
public class CalculationService {

  private final PkInterpreter pkInterpreter;

  public CalculationService(PkInterpreter pkInterpreter) {
    this.pkInterpreter = pkInterpreter;
  }

  public CalculationResponseDto calculateAll(CalculationRequestDto request) {
    List<PointDto> points = request.points();
    double dose = request.dose();

    // Защита от пустых данных
    if (points == null || points.size() < 2) {
      return new CalculationResponseDto(
              0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
              java.util.Map.of(),
              java.util.List.of(),
              new CalculationResponseDto.Summary("info", "", "Недостаточно данных для расчета", java.util.List.of())
      );
    }

    // 1. Поиск Cmax и Tmax
    double cmax = 0.0;
    double tmax = 0.0;
    for (PointDto p : points) {
      if (p.concentration() > cmax) {
        cmax = p.concentration();
        tmax = p.time();
      }
    }

    // 2. Расчет базовых кинетических параметров (порядок вызовов критически важен)
    Double kel = calculateKel(points);
    Double auc = calculateAuc(points, kel);
    Double aumc = calculateAumc(points, kel);

    Double halfLife = calculateHalfLife(kel);
    Double clearance = calculateClearance(dose, auc);
    Double volumeOfDistribution = calculateVolumeOfDistribution(clearance, kel); // Терминальный Vd

    // 3. Некомпартментный анализ (NCA)
    Double mrt = (auc != null && auc > 0) ? (aumc / auc) : 0.0;
    Double vss = clearance * mrt; // Стационарный Vss

    // Собираем единицы измерения
    java.util.Map<String, String> units = java.util.Map.of(
            "auc", "мг·мин/л",
            "halfLife", "мин",
            "clearance", "л/мин",
            "volumeOfDistribution", "л",
            "kel", "мин⁻¹",
            "cmax", "мкг/мл",
            "tmax", "мин",
            "aumc", "мг·мин²/л",
            "mrt", "мин",
            "vss", "л"
    );

    // Карточки и заключение
    java.util.List<CalculationResponseDto.ParameterCard> cards =
            pkInterpreter.buildCards(halfLife, volumeOfDistribution, clearance, cmax, tmax);
    CalculationResponseDto.Summary summary = pkInterpreter.buildSummary(cards, halfLife);

    return new CalculationResponseDto(
            auc, halfLife, clearance, volumeOfDistribution,
            kel, cmax, tmax, aumc, mrt, vss,
            units, cards, summary);
  }

  // Расчёт константы элиминации через линейную регрессию ln(C) vs t
  // Используем последние 3-4 точки (терминальный участок)
  private Double calculateKel(List<PointDto> points) {
    int n = points.size();
    if (n < 3) return 0.0;

    // Берём последние 4 точки (или меньше, если их нет)
    int startIdx = Math.max(1, n - 4);

    double sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    int count = 0;

    for (int i = startIdx; i < n; i++) {
      PointDto p = points.get(i);
      if (p.concentration() <= 0) continue;
      double x = p.time();
      double y = Math.log(p.concentration());
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
      count++;
    }

    if (count < 2) return 0.0;

    double meanX = sumX / count;
    double meanY = sumY / count;
    double denom = sumX2 - count * meanX * meanX;
    if (Math.abs(denom) < 1e-12) return 0.0;

    double slope = (sumXY - count * meanX * meanY) / denom;
    // slope = -kel
    return -slope;
  }

  // Площадь под кривой с экстраполяцией до бесконечности
  private Double calculateAuc(List<PointDto> points, Double kel) {
    double auc = 0.0;
    for (int i = 0; i < points.size() - 1; i++) {
      PointDto p1 = points.get(i);
      PointDto p2 = points.get(i + 1);

      double timeDiff = p2.time() - p1.time();
      double avgConcentration = (p1.concentration() + p2.concentration()) / 2.0;

      auc += timeDiff * avgConcentration;
    }

    // Экстраполяция "хвоста"
    if (kel != null && kel > 0) {
      PointDto lastPoint = points.get(points.size() - 1);
      auc += lastPoint.concentration() / kel;
    }

    return auc;
  }

  // Площадь под кривой первого момента (AUMC) с экстраполяцией
  private Double calculateAumc(List<PointDto> points, Double kel) {
    double aumc = 0.0;
    for (int i = 1; i < points.size(); i++) {
      PointDto p1 = points.get(i - 1);
      PointDto p2 = points.get(i);

      double ct1 = p1.concentration() * p1.time();
      double ct2 = p2.concentration() * p2.time();
      double dt = p2.time() - p1.time();

      aumc += (ct1 + ct2) / 2.0 * dt;
    }

    // Экстраполяция "хвоста" для моментов
    if (kel != null && kel > 0) {
      PointDto lastPoint = points.get(points.size() - 1);
      double clast = lastPoint.concentration();
      double tlast = lastPoint.time();
      aumc += (clast * tlast) / kel + clast / (Math.pow(kel, 2));
    }

    return aumc;
  }

  private Double calculateHalfLife(Double kel) {
    if (kel == null || kel <= 0) return 0.0;
    return 0.693 / kel; // Классическая формула (ln2 / kel)
  }

  private Double calculateClearance(Double dose, Double auc) {
    if (auc == null || auc <= 0 || dose == null) return 0.0;
    return dose / auc;
  }

  private Double calculateVolumeOfDistribution(Double clearance, Double kel) {
    if (kel == null || kel <= 0 || clearance == null) return 0.0;
    return clearance / kel;
  }
}