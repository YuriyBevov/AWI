// let scrollbarWidth = 0;
// function disableScroll() {
// 	// Проверяем, есть ли скроллбар
// 	if (window.innerWidth > document.documentElement.clientWidth) {
// 		scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
// 	}

// 	document.body.style.overflow = "hidden";
// 	document.body.style.paddingRight = `${scrollbarWidth}px`;
// }

// function enableScroll() {
// 	document.body.style.overflow = "";
// 	document.body.style.paddingRight = "";
// }

export const bodyLocker = (isLocked) => {
	const body = document.querySelector("body");

	if (isLocked) {
		body.style.overflow = "hidden";
		// disableScroll();
	} else {
		body.style.overflow = "auto";
		// enableScroll();
	}
};
