import { gsap } from "gsap";
import { focusTrap } from "@js/utils/focusTrap";
import { bodyLocker } from "@js/utils/bodyLocker";

const burger = document.querySelector(".burger");

if (burger) {
	const burgerTopLine = burger.querySelector(".burger-line--top");
	const burgerBottomLine = burger.querySelector(".burger-line--bottom");
	const POS_Y = 4;
	const ROTATE_DEG = 45;

	const burgerTopLineAnimation = gsap.fromTo(
		burgerTopLine,
		{
			y: 0,
			rotate: 0,
		},
		{
			y: `${POS_Y}`,
			rotate: `${ROTATE_DEG}`,
			duration: 0.4,
			ease: "ease-in",
			paused: true,
		},
	);

	const burgerBottomLineAnimation = gsap.fromTo(
		burgerBottomLine,
		{
			y: 0,
			rotate: 0,
		},
		{
			y: `-${POS_Y}`,
			rotate: `-${ROTATE_DEG}`,
			duration: 0.4,
			ease: "ease-in",
			paused: true,
		},
	);

	let isActive = false;

	const burgerAnimation = () => {
		if (isActive) {
			burgerTopLineAnimation.play();
			burgerBottomLineAnimation.play();
		} else {
			burgerTopLineAnimation.reverse();
			burgerBottomLineAnimation.reverse();
		}
	};

	const navMenu = document.querySelector(".nav--header");
	const navMenuWrapper = navMenu.querySelector(".nav__wrapper");

	const onClickCloseMenu = (evt) => {
		if (navMenuWrapper.contains(evt.target)) return;

		isActive = false;
		burgerAnimation();
		openNavMenuHandler();
	};

	// Обработчик для якорных ссылок в мобильном меню
	const onClickNavLink = (evt) => {
		const link = evt.target.closest('a[href^="#"]');
		if (!link) return;

		// Проверяем, что ссылка находится внутри nav__wrapper (активная часть меню)
		if (!link.closest(".nav__wrapper")) return;

		const href = link.getAttribute("href");
		const target = document.querySelector(href);

		if (target) {
			// Закрываем меню
			isActive = false;
			burgerAnimation();
			openNavMenuHandler();
		}
	};

	const onKeyDown = (event) => {
		if (event.key === "Escape" || event.key === "Esc" || event.keyCode === 27) {
			isActive = false;
			burgerAnimation();
			openNavMenuHandler();
		}
	};

	const onResizeHandler = () => {
		if (window.innerWidth > 959) {
			isActive = false;
			burgerAnimation();
			openNavMenuHandler();
			bodyLocker(false);
		}
	};

	const addEventListeners = () => {
		navMenu.addEventListener("click", onClickCloseMenu);
		navMenuWrapper.addEventListener("click", onClickNavLink);
		document.addEventListener("keydown", onKeyDown);
		window.addEventListener("resize", onResizeHandler);
	};

	const removeEventListeners = () => {
		navMenu.removeEventListener("click", onClickCloseMenu);
		navMenuWrapper.removeEventListener("click", onClickNavLink);
		document.removeEventListener("keydown", onKeyDown);
		window.removeEventListener("resize", onResizeHandler);
	};

	const navMenuAnimation = gsap.fromTo(
		navMenu,
		{
			backgroundColor: "tansparent",
			backdropFilter: "blur(3px)",
			alpha: 0,
			visibility: "hidden",
		},
		{
			backgroundColor: "rgba(0, 53, 107, 0.4)",
			backdropFilter: "blur(3px)",
			alpha: 1,
			visibility: "visible",
			duration: 0.7,
			ease: "ease-in",
			paused: true,
		},
	);

	const navMenuWrapperAnimation = gsap.fromTo(
		navMenuWrapper,
		{
			x: "100vw",
		},
		{
			x: "0",
			duration: 0.4,
			delay: 0.2,
			ease: "ease-in",
			paused: true,

			onComplete: () => {
				addEventListeners();
			},
			onReverseComplete: () => {
				bodyLocker(false);
				removeEventListeners();
			},
		},
	);

	const openNavMenuHandler = () => {
		if (isActive) {
			navMenuAnimation.play();
			navMenuWrapperAnimation.play();
		} else {
			navMenuAnimation.reverse();
			navMenuWrapperAnimation.reverse();
		}
	};

	const onClickOpenMenu = (evt) => {
		isActive = !isActive;

		burgerAnimation();
		openNavMenuHandler();

		if (isActive) {
			bodyLocker(true);
			focusTrap(navMenu, 1);
		} else {
			bodyLocker(false);
		}
	};

	burger.addEventListener("click", onClickOpenMenu);
}
