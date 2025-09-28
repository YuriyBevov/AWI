# Утилиты для работы с якорными ссылками

## Обзор

Набор утилит для корректной работы якорных ссылок с учетом sticky header.

## Компоненты

### 1. smoothScroll.js

Основная утилита для плавной прокрутки с учетом высоты sticky header.

#### Методы:

- `smoothScroll.scrollTo(target, options)` - Плавно прокручивает к элементу
- `smoothScroll.createScrollTimeline(target, options)` - Создает GSAP timeline для прокрутки
- `smoothScroll.scrollWithAnimations(target, elementsToAnimate, options)` - Прокрутка с дополнительными анимациями
- `smoothScroll.getHeaderHeight()` - Возвращает высоту header с отступом
- `smoothScroll.init()` - Инициализирует автоматические обработчики

#### Использование:

```javascript
import { smoothScroll } from "./utils/smoothScroll";

// Программная прокрутка
smoothScroll.scrollTo("#about");

// С настройками GSAP
smoothScroll.scrollTo("#about", {
	duration: 1.2,
	ease: "power3.out",
	offset: 50,
});
```

#### Автоматические обработчики:

Утилита автоматически:

- Обрабатывает клики по ссылкам с `href="#..."`
- Добавляет плавную прокрутку
- Обновляет URL в адресной строке
- Добавляет визуальную обратную связь

#### Исключения:

Утилита автоматически исключает из обработки:

- Элементы с классом `.burger` (мобильное меню)
- Ссылки с классом `.btn--anchor` (кнопка "Филиалы")
- Ссылки с атрибутом `data-no-scroll`
- Ссылки вне `.nav__wrapper` в мобильном меню

### 2. headerHeight.js

Утилита для отслеживания высоты header и обновления CSS переменных.

#### Функции:

- Автоматически отслеживает изменения размера header
- Обновляет CSS переменную `--header-height`
- Обрабатывает изменения ориентации устройства

### 3. bodyLocker.js

Утилита для блокировки скролла с предотвращением скачков экрана.

#### Методы:

- `bodyLocker(true)` - Блокирует скролл
- `bodyLocker(false)` - Разблокирует скролл

## CSS

### Переменные:

- `--header-height` - Динамическая высота header (устанавливается автоматически)

### Стили:

```scss
// Автоматический отступ для секций
.section {
	scroll-margin-top: calc(var(--header-height, 100px) + 20px);
}

// Стили для якорных ссылок
a[href^="#"] {
	transition: opacity 0.2s ease;

	&.scrolling {
		opacity: 0.7;
		pointer-events: none;
	}
}
```

## Интеграция

Утилиты автоматически инициализируются при загрузке страницы через `main.js`:

```javascript
import "./utils/smoothScroll";
import "./utils/headerHeight";
```

## Примеры использования

### Базовое использование

Просто добавьте якорные ссылки в HTML:

```html
<a href="#about">О нас</a>
<a href="#courses">Курсы</a>
<a href="#contacts">Контакты</a>
```

### Программная прокрутка

```javascript
import { smoothScroll } from "./utils/smoothScroll";

// Прокрутка к секции "О нас"
smoothScroll.scrollTo("#about");

// Прокрутка с кастомными настройками GSAP
smoothScroll.scrollTo("#courses", {
	duration: 1.2,
	ease: "power3.out",
	offset: 30,
});

// Создание timeline для сложных анимаций
const tl = smoothScroll.createScrollTimeline("#about", {
	duration: 1.0,
	ease: "power2.inOut",
});

// Добавление дополнительных анимаций к timeline
tl.to(
	".section__header",
	{
		y: 0,
		opacity: 1,
		duration: 0.6,
		ease: "power2.out",
	},
	"-=0.3",
);

// Прокрутка с дополнительными анимациями элементов
smoothScroll.scrollWithAnimations(
	"#courses",
	[
		{
			selector: ".course-card",
			animation: {
				y: 0,
				opacity: 1,
				stagger: 0.1,
				duration: 0.5,
				ease: "power2.out",
			},
		},
	],
	{
		duration: 0.8,
		ease: "power2.out",
		animationDelay: 0.2,
	},
);
```

### Интеграция с мобильным меню

В burger.js уже интегрирована поддержка автоматического закрытия меню при клике на якорную ссылку.

## Настройка

### Изменение отступа

Отступ можно настроить в CSS:

```scss
.section {
	scroll-margin-top: calc(
		var(--header-height, 100px) + 40px
	); // Увеличенный отступ
}
```

### Изменение скорости и типа анимации

```javascript
smoothScroll.scrollTo("#target", {
	duration: 0.5, // Быстрая анимация (в секундах для GSAP)
	ease: "power3.out", // Тип анимации
});
```

### Доступные GSAP easing функции:

- `linear` - Линейная анимация
- `power1.out`, `power2.out`, `power3.out` - Ускорение с разной интенсивностью
- `power1.in`, `power2.in`, `power3.in` - Замедление с разной интенсивностью
- `power1.inOut`, `power2.inOut`, `power3.inOut` - Ускорение + замедление
- `back.out`, `back.in`, `back.inOut` - Анимация с "отскоком"
- `elastic.out`, `elastic.in`, `elastic.inOut` - Эластичная анимация
- `bounce.out`, `bounce.in`, `bounce.inOut` - Анимация с "прыжками"

## Поддержка браузеров

- Современные браузеры с поддержкой ES6+
- Автоматический fallback для старых браузеров
- Поддержка мобильных устройств
