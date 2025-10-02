import { gsap } from "gsap";

export class Modal {
	static openModals = new Set();

	constructor(modal, options = {}) {
		this.preventBodyLock = options.preventBodyLock ? true : false;
		this.modal = modal;
		this.overlay = this.modal.parentNode;
		this.close = this.modal.querySelector(".modal-closer");

		this.id = this.modal.getAttribute("id");
		this.openers = document.querySelectorAll(
			'[data-modal-opener="' + this.id + '"]',
		);
		this.isInited = false;

		this.focusableElements = [
			"a[href]",
			"input",
			"select",
			"textarea",
			"button",
			"iframe",
			"[contenteditable]",
			'[tabindex]:not([tabindex^="-"])',
		];
		this.init();
	}

	bodyLocker = (bool) => {
		const body = document.querySelector("body");

		if (bool) {
			body.style.overflow = "hidden";
		} else {
			body.style.overflow = "auto";
		}
	};

	focusTrap = () => {
		const firstFocusableElement = this.modal.querySelectorAll(
			this.focusableElements,
		)[0];
		const focusableContent = this.modal.querySelectorAll(
			this.focusableElements,
		);
		const lastFocusableElement = focusableContent[focusableContent.length - 1];

		if (focusableContent.length) {
			const onBtnClickHandler = (evt) => {
				const isTabPressed = evt.key === "Tab" || evt.key === 9;

				if (evt.key === "Escape") {
					document.removeEventListener("keydown", onBtnClickHandler);
				}

				if (!isTabPressed) {
					return;
				}

				if (evt.shiftKey) {
					if (document.activeElement === firstFocusableElement) {
						lastFocusableElement.focus();
						evt.preventDefault();
					}
				} else {
					if (document.activeElement === lastFocusableElement) {
						firstFocusableElement.focus();
						evt.preventDefault();
					}
				}
			};

			document.addEventListener("keydown", onBtnClickHandler);

			firstFocusableElement.focus();
		}
	};

	addListeners = () => {
		if (this.openers) {
			this.openers.forEach((opener) => {
				opener.removeEventListener("click", this.openModal);
			});
		}

		document.addEventListener("click", this.closeByOverlayClick);
		document.addEventListener("keydown", this.closeByEscBtn);

		if (this.close) {
			this.close.addEventListener("click", this.closeByBtnClick);
		}
	};

	refresh = () => {
		document.removeEventListener("click", this.closeByOverlayClick);
		document.removeEventListener("keydown", this.closeByEscBtn);

		if (this.close) {
			this.close.removeEventListener("click", this.closeByBtnClick);
		}

		gsap.fromTo(
			this.overlay,
			{ display: "flex" },
			{
				opacity: 0,
				display: "none",
				duration: 0.6,
				ease: "ease-in",
				onComplete: () => {
					//если в модалке есть форма, при закрытии обнуляю поля
					this.modal.querySelectorAll("form").forEach((f) => f.reset());
					Modal.openModals.delete(this.id);
				},
			},
		);

		if (!this.preventBodyLock) {
			this.bodyLocker(false);
		}

		if (this.openers) {
			this.openers.forEach((opener) => {
				opener.addEventListener("click", this.openModal);
			});
		}
	};

	closeByOverlayClick = (evt) => {
		if (evt.target === this.overlay) {
			this.refresh();
		}
	};

	closeByEscBtn = (evt) => {
		if (evt.key === "Escape") {
			this.refresh();
		}
	};

	closeByBtnClick = () => {
		this.refresh();
	};

	static closeAllModals = () => {
		Modal.openModals.forEach((modalId) => {
			const modal = document.getElementById(modalId);
			if (modal) {
				const modalInstance = modal._modalInstance;
				if (modalInstance) {
					modalInstance.refresh();
				}
			}
		});
		Modal.openModals.clear();
	};

	openModal = (evt) => {
		evt.preventDefault();

		const affiliate = evt.currentTarget.getAttribute("data-affiliate");

		if (affiliate) {
			document
				.querySelector("#affiliate-modal")
				.querySelector("[data-name]").value = affiliate;
		}

		const program = evt.currentTarget.getAttribute("data-program");
		if (program) {
			this.modal.querySelector("[data-name]").value = program;
		}

		const isUnderlayed = this.modal.classList.contains("modal--underlayed");

		if (!isUnderlayed) {
			Modal.closeAllModals();
		}

		if (!this.preventBodyLock) {
			this.bodyLocker(false);
		}

		gsap.set(this.modal, { alpha: 0, y: 150, x: "-50%" });
		gsap.fromTo(
			this.overlay,
			{ display: "none", alpha: 0 },
			{
				display: "flex",
				alpha: 1,
				duration: 0.6,
				ease: "ease-in",
				onComplete: () => {
					this.addListeners();
					this.focusTrap();
					Modal.openModals.add(this.id);

					gsap.fromTo(
						this.modal,
						{
							alpha: 0,
							y: 150,
							x: "-50%",
						},
						{
							alpha: 1,
							y: "-50%",
							x: "-50%",
							duration: 1,
							ease: "ease-in",
						},
						"-=0.3",
					);
				},
			},
		);
	};

	show = () => {
		const isUnderlayed = this.modal.classList.contains("modal--underlayed");

		if (!isUnderlayed) {
			Modal.closeAllModals();
		}

		if (!this.preventBodyLock) {
			this.bodyLocker(true);
		}
		gsap.fromTo(
			this.overlay,
			{ display: "none", alpha: 0 },
			{
				display: "flex",
				alpha: 1,
				duration: 0.6,
				ease: "ease-in",
				onComplete: () => {
					this.addListeners();
					this.focusTrap();
					Modal.openModals.add(this.id);
				},
			},
		);
	};

	init() {
		this.modal._modalInstance = this;

		if (this.openers) {
			this.isInited = true;
			this.openers.forEach((opener) => {
				opener.addEventListener("click", this.openModal);
			});
		} else {
			console.error(
				"Не добавлена кнопка открытия модального окна, либо в ней не прописан аттр-т: data-modal-opener={modal-id} ",
			);
		}
	}
}
