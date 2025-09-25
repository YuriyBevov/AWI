class Switcher {
	constructor() {
		this.init();
	}

	init() {
		this.bindEvents();
	}

	bindEvents() {
		document.addEventListener("click", (e) => {
			const button = e.target.closest(".switcher button");
			if (button) {
				e.preventDefault();
				this.handleSwitch(button);
			}
		});
	}

	handleSwitch(activeButton) {
		const contentId = activeButton.getAttribute("data-content-id");

		if (!contentId) return;

		this.hideAllItems();
		this.showItem(contentId);
		this.updateActiveButton(activeButton);
	}

	hideAllItems() {
		const allItems = document.querySelectorAll(".switch-item");
		allItems.forEach((item) => {
			item.classList.remove("active");
		});
	}

	showItem(contentId) {
		const targetItem = document.querySelector(
			`.switch-item[data-id="${contentId}"]`,
		);
		if (targetItem) {
			targetItem.classList.add("active");
		}
	}

	updateActiveButton(activeButton) {
		const allButtons = document.querySelectorAll(".switcher button");
		allButtons.forEach((button) => {
			button.classList.remove("active");
		});
		activeButton.classList.add("active");
	}
}

document.addEventListener("DOMContentLoaded", () => {
	new Switcher();
});
