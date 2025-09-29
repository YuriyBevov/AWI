document.addEventListener("click", function (evt) {
	const opener = evt.target.closest('[data-modal-opener="affiliate-modal"]');
	if (!opener) return;

	const card = opener.closest(".schedule-card");
	const container = card.parentElement;
	const template = container.querySelector("template#affiliate-modal-tpl");

	const modalContent = template.content.cloneNode(true);
	const modal = document.getElementById("affiliate-modal");
	const modalContentContainer = modal.querySelector(".modal-content");

	const modalHeaderTitle = modal.querySelector(".modal-header span.title");
	if (modalHeaderTitle && template.hasAttribute("data-title")) {
		modalHeaderTitle.textContent = template.getAttribute("data-title");
	}

	modalContentContainer.innerHTML = "";
	modalContentContainer.appendChild(modalContent);
});
