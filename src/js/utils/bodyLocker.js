export const bodyLocker = (isLocked) => {
	const body = document.querySelector("body");

	// Предотвращаем повторные вызовы с одинаковым состоянием
	if (body.dataset.locked === isLocked.toString()) {
		return;
	}

	if (isLocked) {
		// Получаем ширину полосы прокрутки
		const scrollbarWidth =
			window.innerWidth - document.documentElement.clientWidth;

		// Сохраняем текущую позицию скролла
		const scrollY = window.scrollY;

		// Блокируем скролл
		body.style.overflow = "hidden";

		// Компенсируем ширину полосы прокрутки только если она больше 0
		// (на мобильных устройствах полоса прокрутки обычно не отображается)
		if (scrollbarWidth > 0) {
			body.style.paddingRight = `${scrollbarWidth}px`;
		}

		// Фиксируем позицию скролла
		body.style.position = "fixed";
		body.style.top = `-${scrollY}px`;
		body.style.width = "100%";

		// Сохраняем позицию скролла для восстановления
		body.dataset.scrollY = scrollY.toString();

		// Отмечаем, что скролл заблокирован
		body.dataset.locked = "true";
	} else {
		// Восстанавливаем скролл
		body.style.overflow = "";
		body.style.paddingRight = "";
		body.style.position = "";
		body.style.top = "";
		body.style.width = "";

		// Восстанавливаем позицию скролла
		const scrollY = parseInt(body.dataset.scrollY || "0", 10);
		window.scrollTo(0, scrollY);

		// Очищаем сохраненную позицию
		delete body.dataset.scrollY;

		// Отмечаем, что скролл разблокирован
		body.dataset.locked = "false";
	}
};
