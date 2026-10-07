package ru.mas.toximas.dto.toxicokinetic;

import java.util.List;
import java.util.Map;

// ВАЖНО (единицы):
//   auc                  — мг·мин/л
//   halfLife             — мин
//   clearance            — л/мин
//   volumeOfDistribution — л
//   kel                  — мин⁻¹
//   cmax                 — мкг/мл (= мг/л)
//   tmax                 — мин
//   aumc                 — мг·мин²/л
//   mrt                  — мин
//   vss                  — л
public record CalculationResponseDto(
        Double auc,
        Double halfLife,
        Double clearance,
        Double volumeOfDistribution,
        Double kel,
        Double cmax,
        Double tmax,
        Double aumc,
        Double mrt,
        Double vss,

        // Ключ — имя параметра ("auc", "halfLife", ...), значение — строка с единицей
        Map<String, String> units,

        // ============ карточки для отображения ============
        List<ParameterCard> cards,
        // ============ итоговое заключение ============
        Summary summary
) {
  // ====================================================================
  // ВЛОЖЕННЫЙ RECORD №1: ParameterCard
  // --------------------------------------------------------------------
  // Описывает ОДНУ карточку параметра для отображения на фронте.
  // Например: карточка "Период полувыведения (t½)" со значением 10.14 мин,
  // статусом "info", текстом интерпретации и рекомендацией.
  // ====================================================================
  public record ParameterCard(
          String id,              // "halfLife" — уникальный идентификатор
          String title,           // "Период полувыведения (t½)" — заголовок карточки
          Double value,           // 10.14 — числовое значение
          String unit,            // "мин" — единица измерения
          String status,          // "green" | "yellow" | "red" | "info" — цветовой статус
          String icon,            // "clock" — имя иконки для фронта
          String interpretation,  // "Препарат выводится очень быстро..." — что это значит
          String recommendation,  // "Полное выведение занимает ~50 мин" — что делать
          String reference        // "Короткий: <30 мин · Средний: 30 мин–6 ч..." — справка о порогах
  ) {
  }

  // ====================================================================
  // ВЛОЖЕННЫЙ RECORD №2: Summary
  // --------------------------------------------------------------------
  // Описывает ИТОГОВОЕ экспертное заключение — то, что показывается
  // в отдельном блоке под всеми карточками.
  // ====================================================================
  public record Summary(
          String status,          // "green" | "yellow" | "red" — общий статус препарата
          String headline,        // "Фармакокинетический профиль" — короткий заголовок
          String text,            // Развёрнутый текст заключения
          List<String> warnings   // Список предупреждений (может быть пустым)
  ) {
  }

}
