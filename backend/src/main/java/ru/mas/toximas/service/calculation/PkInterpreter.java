package ru.mas.toximas.service.calculation;

import org.springframework.stereotype.Service;
import ru.mas.toximas.dto.toxicokinetic.CalculationResponseDto.ParameterCard;
import ru.mas.toximas.dto.toxicokinetic.CalculationResponseDto.Summary;

import java.util.ArrayList;
import java.util.List;

/**
 * Сервис интерпретации токсикокинетических параметров.
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
              "Очень быстрое выведение: концентрация в плазме снижается вдвое каждые ~%.1f мин.", tHalf);
      recommendation = String.format(
              "За 5 периодов (~%.0f мин) из организма выводится ~97%% вещества.", tHalf * 5);
    } else if (tHalf < 360) {
      status = "green";
      interpretation = String.format(
              "Средний период полувыведения (~%.1f мин).", tHalf);
      recommendation = String.format(
              "Полное выведение (~97%%) занимает около %.1f ч.", tHalf * 5 / 60);
    } else if (tHalf < 1440) {
      status = "yellow";
      interpretation = "Длинный период полувыведения. Вещество длительно циркулирует в организме.";
      recommendation = "Возможна кумуляция при повторных поступлениях. Требуется контроль концентрации.";
    } else {
      status = "red";
      interpretation = "Очень длинный период полувыведения. Высокий риск накопления.";
      recommendation = "Требуется длительное наблюдение и мониторинг концентрации в плазме.";
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
      interpretation = "Вещество остаётся преимущественно в плазме крови.";
      recommendation = "Эффективны методы экстракорпоральной детоксикации (гемодиализ, плазмаферез).";
    } else if (vd < 15) {
      status = "green";
      interpretation = "Распределяется во внеклеточной жидкости.";
      recommendation = "Частично доступно для экстракорпоральной элиминации.";
    } else if (vd < 40) {
      status = "yellow";
      interpretation = "Распределяется по всем водным секторам организма.";
      recommendation = "Экстракорпоральные методы малоэффективны.";
    } else {
      status = "red";
      interpretation = "Активно депонируется в тканях (вероятно, липофильное вещество).";
      recommendation = "Гемодиализ малоэффективен. Требуется симптоматическая терапия.";
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
      interpretation = "Низкий клиренс. Вещество медленно выводится из организма.";
      recommendation = "Возможна кумуляция. Требуется контроль концентрации в плазме.";
    } else if (cl < 1.5) {
      status = "green";
      interpretation = "Нормальный клиренс (в пределах физиологических значений человека).";
      recommendation = "Органы выделения (печень, почки) функционируют в обычном режиме.";
    } else {
      status = "yellow";
      interpretation = "Высокий клиренс, близкий к органному кровотоку.";
      recommendation = "Вещество быстро элиминируется. Возможно, требуется повторное поступление для поддержания концентрации.";
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
      recommendation = "Вещество быстро всасывается. Пик концентрации наступает почти сразу.";
    } else if (tmax < 120) {
      status = "green";
      interpretation = String.format("Средняя скорость достижения Cmax (Tmax = %.0f мин).", tmax);
      recommendation = "Всасывание происходит постепенно в течение часа-двух.";
    } else {
      status = "yellow";
      interpretation = String.format("Медленное достижение Cmax (Tmax = %.0f мин).", tmax);
      recommendation = "Поступление замедлено. Возможно, вещество принято с пищей или имеет пролонгированную форму.";
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
            "Вещество имеет период полувыведения ~%.1f мин. " +
                    "Токсикокинетический профиль оценён по %d ключевым параметрам. " +
                    "См. карточки выше для детальной интерпретации.",
            tHalf, cards.size()
    );

    return new Summary(
            status,
            "Токсикокинетический профиль",
            text,
            new ArrayList<>()
    );
  }
}