package ru.mas.toximas.service.calculation;

import org.springframework.stereotype.Service;
import ru.mas.toximas.dto.core.GroupDto;
import ru.mas.toximas.dto.toxicometry.ToxicometryRequestDto;
import ru.mas.toximas.dto.toxicometry.ToxicometryResponseDto;
import java.util.List;

@Service
public class ToxicometryService {

  public ToxicometryResponseDto calculateLethalDoses(ToxicometryRequestDto request) {
    List<GroupDto> groups = request.groups();

    int n = 0;
    double sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

    for (GroupDto group : groups) {
      if (group.dose() == null || group.dose() <= 0 || group.total() == null || group.total() <= 0) {
        continue;
      }

      double p = (double) group.effect() / group.total();

      if (p <= 0.0) p = 0.01;
      if (p >= 1.0) p = 0.99;

      double x = Math.log10(group.dose());
      double y = calculateProbit(p);

      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
      sumY2 += y * y; // Нужно для вычисления дисперсии
      n++;
    }

    if (n < 2) {
      throw new IllegalArgumentException("Недостаточно данных для расчета регрессии");
    }

    // Суммы квадратов отклонений
    double ssXx = sumX2 - (sumX * sumX) / n;
    double ssYy = sumY2 - (sumY * sumY) / n;
    double ssXy = sumXY - (sumX * sumY) / n;

    double meanX = sumX / n;
    double meanY = sumY / n;

    // Коэффициенты регрессии Y = a + bX
    double b = ssXy / ssXx;
    double a = meanY - b * meanX;

    // Расчет логарифмов летальных доз
    double logLd16 = (4.0 - a) / b;
    double logLd50 = (5.0 - a) / b;
    double logLd84 = (6.0 - a) / b;

    Double ld16 = Math.pow(10, logLd16);
    Double ld50 = Math.pow(10, logLd50);
    Double ld84 = Math.pow(10, logLd84);

    // Расчет стандартной ошибки для LD50
    Double ld50Error = 0.0;
    if (n > 2) {
      // Остаточная дисперсия
      double s2 = (ssYy - b * ssXy) / (n - 2);

      // Дисперсия для логарифма LD50
      double varLogLd50 = (s2 / (b * b)) * (1.0 / n + Math.pow(logLd50 - meanX, 2) / ssXx);
      double seLogLd50 = Math.sqrt(varLogLd50);

      // Дельта-метод для перевода ошибки из логарифмической шкалы в линейную
      ld50Error = ld50 * Math.log(10) * seLogLd50;
    }

    return new ToxicometryResponseDto(ld16, ld50, ld84, ld50Error, a, b);
  }

  private double calculateProbit(double p) {
    double t = Math.sqrt(-2.0 * Math.log(p < 0.5 ? p : 1.0 - p));
    double c0 = 2.515517, c1 = 0.802853, c2 = 0.010328;
    double d1 = 1.432788, d2 = 0.189269, d3 = 0.001308;

    double z = t - ((c2 * t + c1) * t + c0) / (((d3 * t + d2) * t + d1) * t + 1.0);
    return (p < 0.5 ? -z : z) + 5.0;
  }
}