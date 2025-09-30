import { sendForm } from "./send-form";

export const formValidation = (form) => {
	const fields = form.querySelectorAll("[data-required]");

	const setInvalidStatus = (field) => {
		!field.classList.contains("invalid-control")
			? field.classList.add("invalid-control")
			: null;

		field.classList.add("shaker");

		setTimeout(() => {
			field.classList.remove("shaker");
		}, 800);
	};

	const setValidStatus = (field) => {
		field.classList.contains("invalid-control")
			? field.classList.remove("invalid-control")
			: null;
	};

	fields.forEach((field) => {
		field.addEventListener("input", () => {
			setValidStatus(field);
		});

		switch (field["type"]) {
			case "textarea":
				if (field.value.trim().length <= 0) {
					setInvalidStatus(field);
				} else {
					setValidStatus(field);
				}
				break;
			case "text":
				if (field.value.trim().length < 2) {
					setInvalidStatus(field);
				} else {
					setValidStatus(field);
				}
				break;
			case "tel":
				if (field.value.trim().length < 21) {
					setInvalidStatus(field);
				} else {
					setValidStatus(field);
				}
				break;
			case "checkbox":
				if (!field.checked) {
					setInvalidStatus(field);
				} else {
					setValidStatus(field);
				}
				break;
		}
	});

	const isInvalid = document.querySelector(".invalid-control");

	if (!isInvalid) {
		sendForm(form);
	}
};
