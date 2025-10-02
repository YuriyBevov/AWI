import { Modal } from "../classes/Modal";

const GOOGLE_CAPTHCA_V_3_SITE_KEY = "6LcqKtsrAAAAADP-s2exb2byUIAwPQ9s-QOD3okN";

export function sendForm(form) {
	const loader = document.querySelector(".loader");
	const successModal = document.querySelector(".success-modal");
	const errorModal = document.querySelector(".error-modal");

	loader.classList.add("active");

	function hideLoader() {
		loader.classList.remove("active");
	}

	function success() {
		hideLoader();
		form.reset();

		const currentModal = form.closest(".modal");

		if (currentModal) {
			new Modal(currentModal).refresh();
		}

		setTimeout(() => {
			new Modal(successModal).show();
		}, 700);
	}

	function error() {
		hideLoader();
		new Modal(errorModal, {
			preventBodyLock: true,
		}).show();
	}

	// const data = new FormData(form);
	// ajax(form.method, form.action, data, success, error);

	// function ajax(method, url, data, success, error) {
	// 	const xhr = new XMLHttpRequest();
	// 	xhr.open(method, url);
	// 	xhr.setRequestHeader("Accept", "application/json");
	// 	xhr.onreadystatechange = function () {
	// 		if (xhr.readyState !== XMLHttpRequest.DONE) return;
	// 		if (xhr.status === 200) {
	// 			success(xhr.response, xhr.responseType);
	// 		} else {
	// 			error(xhr.status, xhr.response, xhr.responseType);
	// 		}
	// 	};
	// 	xhr.send(data);
	// }

	grecaptcha.ready(function () {
		grecaptcha
			.execute(GOOGLE_CAPTHCA_V_3_SITE_KEY, { action: "submit" })
			.then(function (token) {
				form.querySelector(".g-recaptcha-response").value = token;
				console.log("TOKEN", token);

				const data = new FormData(form);
				ajax(form.method, form.action, data, success, error);

				function ajax(method, url, data, success, error) {
					const xhr = new XMLHttpRequest();
					xhr.open(method, url);
					xhr.setRequestHeader("Accept", "application/json");
					xhr.onreadystatechange = function () {
						if (xhr.readyState !== XMLHttpRequest.DONE) return;
						if (xhr.status === 200) {
							success(xhr.response, xhr.responseType);
						} else {
							error(xhr.status, xhr.response, xhr.responseType);
						}
					};
					xhr.send(data);
				}
			});
	});
}
