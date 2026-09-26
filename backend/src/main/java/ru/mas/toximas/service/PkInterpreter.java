package ru.mas.toximas.service;

import org.springframework.stereotype.Service;
import ru.mas.toximas.dto.CalculationResponseDto.ParameterCard;
import ru.mas.toximas.dto.CalculationResponseDto.Summary;

import java.util.ArrayList;
import java.util.List;

/**
 * Сервис интерпретации фармакокинетических параметров.
 * Принимает числовые значения, возвращает готовые карточки с выводами.
 *
 * ВАЖНО (единицы):
 *   tHalf — минуты
 *   vd    — литры
 *   cl    — л/мин
 *   cmax  — мкг/мл
 *   tmax  — минуты
 */
@Service
public class PkInterpreter {

  public List<ParameterCard> buildCards(double tHalf, double vd, double cl,
                                        double cmax, double tmax) {
    List<ParameterCard> cards = new ArrayList<>();
    cards.add(interpretHalfLife(tHalf));
    cards.add(interpretVd(vd));
    cards.add(interpretClearance(cl));
    cards.add(interpretCmaxTmax(cmax, tmax));
    return cards;
  }

  private ParameterCard interpretHalfLife(double tHalf) {
    String status;
    String interpretation;
    String recommendation;

    if (tHalf < 30) {
      status = "info";
      interpretation = String.format(
              "Препарат выводится очень быстро: концентрация в плазме снижается вдвое каждые ~%.1f мин.", tHalf);
      recommendation = String.format(
              "Полное выведение (~97%%) занимает около %.0f мин. Риск кумуляции минимален.", tHalf * 5);
    } else if (tHalf < 360) {
      status = "green";
      interpretation = "Средний период полувыведения. Приём 3–4 раза в сутки.";
      recommendation = String.format(
              "Стабильная концентрация устанавливается через %.1f ч.", tHalf * 5 / 60);
    } else if (tHalf < 1440) {
      status = "yellow";
      interpretation = "Длинный период полувыведения. Достаточно 1–2 приёмов в сутки.";
      recommendation = "Следить за возможной кумуляцией при повторном введении.";
    } else {
      status = "red";
      interpretation = "Очень длинный период полувыведения. Высокий риск накопления.";
      recommendation = "Требуется терапевтический лекарственный мониторинг (ТЛМ).";
    }

    return new ParameterCard(
            "halfLife", "Период полувыведения (t½)",
            tHalf, "мин", status, "clock",
            interpretation, recommendation,
            "Короткий: <30 мин · Средний: 30 мин–6 ч · Длинный: >6 ч"
    );
  }

  private ParameterCard interpretVd(double vd) {
    String status, interpretation, recommendation;

    if (vd < 5) {
      status = "green";
      interpretation = "Препарат остаётся преимущественно в плазме крови.";
      recommendation = "Коррекция дозы при ожирении/кахексии не требуется.";
    } else if (vd < 15) {
      status = "green";
      interpretation = "Распределяется во внеклеточной жидкости.";
      recommendation = "Стандартный режим дозирования.";
    } else if (vd < 40) {
      status = "yellow";
      interpretation = "Распределяется по всем водным секторам организма.";
      recommendation = "Учитывать при расчёте нагрузочной дозы.";
    } else {
      status = "red";
      interpretation = "Активно накапливается в тканях (вероятно, липофильный).";
      recommendation = "Требуется коррекция при ожирении. Контроль тканевых концентраций.";
    }

    return new ParameterCard(
            "volumeOfDistribution", "Объём распределения (Vd)",
            vd, "л", status, "flask",
            interpretation, recommendation,
            "Плазма: <5 л · Внеклеточная жидкость: 5–15 л · Все ткани: >40 л"
    );
  }

  private ParameterCard interpretClearance(double cl) {
    String status, interpretation, recommendation;

    if (cl < 0.1) {
      status = "yellow";
      interpretation = "Низкий клиренс. Препарат медленно выводится.";
      recommendation = "Возможна кумуляция. Рассмотреть снижение дозы.";
    } else if (cl < 1.5) {
      status = "green";
      interpretation = "Нормальный клиренс (в пределах физиологических значений).";
      recommendation = "Стандартный режим дозирования.";
    } else {
      status = "yellow";
      interpretation = "Высокий клиренс, близкий к органному кровотоку.";
      recommendation = "Возможно, требуется инфузия для поддержания концентрации.";
    }

    return new ParameterCard(
            "clearance", "Общий клиренс (CL)",
            cl, "л/мин", status, "kidney",
            interpretation, recommendation,
            "Низкий: <0.1 л/мин · Норма: 0.1–1.5 л/мин · Высокий: >1.5 л/мин"
    );
  }

  private ParameterCard interpretCmaxTmax(double cmax, double tmax) {
    String status, interpretation, recommendation;

    if (tmax < 15) {
      status = "green";
      interpretation = String.format("Быстрое достижение Cmax (Tmax = %.0f мин).", tmax);
      recommendation = "Подходит для купирования острых состояний.";
    } else if (tmax < 120) {
      status = "green";
      interpretation = "Средняя скорость достижения максимума.";
      recommendation = "Стандартный режим.";
    } else {
      status = "yellow";
      interpretation = String.format("Медленное достижение Cmax (Tmax = %.0f мин).", tmax);
      recommendation = "Возможно влияние пищи или пролонгированная форма.";
    }

    return new ParameterCard(
            "cmaxTmax", "Cmax / Tmax",
            cmax, "мкг/мл", status, "chart",
            interpretation, recommendation,
            "Cmax в мкг/мл, Tmax в минутах"
    );
  }

  public Summary buildSummary(List<ParameterCard> cards, double tHalf) {
    long redCount = cards.stream().filter(c -> "red".equals(c.status())).count();
    long yellowCount = cards.stream().filter(c -> "yellow".equals(c.status())).count();

    String status = redCount > 0 ? "red" : (yellowCount > 0 ? "yellow" : "green");

    String text = String.format(
            "Препарат имеет период полувыведения ~%.1f мин. " +
                    "Профиль распределения и выведения оценён по %d ключевым параметрам. " +
                    "См. карточки выше для детальной интерпретации.",
            tHalf, cards.size()
    );

    return new Summary(
            status,
            "Фармакокинетический профиль",
            text,
            new ArrayList<>()
    );
  }
}
