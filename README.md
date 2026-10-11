# toxiMAc

Приложение для расчёта фармакокинетических и токсикометрических показателей.

## О проекте

**toxiMAc** — это веб-приложение для расчёта и интерпретации фармакокинетических параметров и токсикометрических показателей. Разработано для специалистов в области фармакологии, токсикологии и доклинических исследований.

### Основные возможности

- **Токсикометрия** — расчёт доз методом пробит-анализа
- **Токсикокинетика** — расчёт AUC, Cmax, Tmax, t½, Vd, CL, MRT, Vss методом NCA
- **Интерактивные графики** — кривая «доза–эффект» и «концентрация–время»
- **Сохранение исследований** — база данных H2, поиск, пагинация
- **Мои исследования** — просмотр, детали, удаление
- **Справочник** — научная интерпретация параметров
- **Экспорт** — графики в PNG

## Технологии

### Backend
- **Java 17**
- **Spring Boot 3.3.5**
- **Spring Data JPA** + **Hibernate**
- **H2 Database**
- **Lombok**
- **Maven**

### Frontend
- **React 18**
- **Vite** 
- **Tailwind CSS** 
- **Recharts**
- **React Router**

## Структура проекта
Проект разделён на две части: **backend** (Spring Boot) и **frontend** (React + Vite).

**Backend** (`backend/src/main/java/ru/mas/toximas/`):

- `controller/calculation/` — NCA + LD расчёты
- `controller/toxicokinetic/` — CRUD токсикокинетики
- `controller/toxicometry/` — CRUD токсикометрии
- `dto/core/`, `dto/toxicokinetic/`, `dto/toxicometry/` — DTO по папкам
- `entity/` — JPA-сущности
- `repository/` — Spring Data репозитории
- `service/calculation/`, `service/toxicokinetic/`, `service/toxicometry/` — бизнес-логика

**Frontend** (`frontend/src/`):

- `api/` — fetch-обёртки для запросов к бэкенду
- `components/experiments/` — модалка + карточки исследований
- `components/layout/` — Header, Sidebar
- `components/shared/` — ParameterCard, AI-панель
- `components/toxicokinetics/`, `components/toxicometry/` — компоненты страниц
- `constants/` — API URL, цвета, пути
- `pages/` — страницы приложения
- `utils/` — форматтеры, расчёты
- `App.jsx` — корневой компонент

## Быстрый старт

### Требования
- **Java 17+** (JDK)
- **Node.js 18+** + **npm**
- **Maven** (или `./mvnw` в комплекте)

### 1. Клонирование репозитория
```bash
git clone https://github.com/AlekSMakacheev/toxiMAc.git
cd toxiMAc
```

### 2. Запуск Backend
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Запуск Frontend
```bash
cd frontend
npm install
npm run dev
```

## Скачать и запустить

### Готовый релиз (Windows)
1. Скачайте папку `release/` из раздела [Releases](https://github.com/AlekSMakacheev/toxiMAc/releases).
2. Распакуйте в любую папку.
3. Двойной клик по **`toxiMAc.bat`**.
4. Через 15–20 секунд откроется браузер с приложением на `http://localhost:8080`.

**Java устанавливать не нужно** — она встроена в папку `jre/`.

### Если первый запуск долгий
Некоторые антивирусы (Dr.Web, Kaspersky, Avast) сканируют JAR при первом запуске, что замедляет старт до 60–90 секунд.
**Решение:** добавьте папку `release/` в исключения антивируса. После этого запуск будет занимать 10–15 секунд.

### Иконка на рабочем столе (опционально)

Чтобы у приложения была красивая иконка на рабочем столе:

1. Правой кнопкой на `toxiMAc.bat` → **Отправить** → **Рабочий стол (создать ярлык)**.
2. На рабочем столе правой кнопкой на ярлыке → **Свойства**.
3. Вкладка **«Ярлык»** → кнопка **«Сменить значок»**.
4. **Обзор** → выберите файл `toximac.ico` из папки `release/`.
5. **OK** → **Применить**.

Готово — ярлык с иконкой toxiMAc на рабочем столе.

### Остановка приложения
Откройте **Диспетчер задач** (`Ctrl+Shift+Esc`) → найдите процесс **`javaw.exe`** → **Снять задачу**.

### База данных
Все исследования сохраняются в файл `release/data/toximac.mv.db`. Чтобы перенести данные на другой комп — скопируйте папку `release/` целиком (вместе с `data/`).

## Скриншоты
![alt text](docs/image-1.png)
![alt text](docs/image-2.png)
![alt text](docs/image-3.png)
![alt text](docs/image-4.png)

## Автор
**AlekSMakacheev**
- GitHub: [@AlekSMakacheev](https://github.com/AlekSMakacheev)