import { Swiper } from "swiper";
import { Navigation, Pagination } from "swiper/modules";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
import "swiper/css";

document.addEventListener("DOMContentLoaded", function () {
	const baseSliders = document.querySelectorAll(".base-slider");

	if (baseSliders.length) {
		baseSliders.forEach((slider) => {
			new Swiper(slider, {
				modules: [Navigation, Pagination],
				slidesPerView: "auto",
				spaceBetween: 30,
				navigation: {
					nextEl: slider.querySelector(".swiper-button-next"),
					prevEl: slider.querySelector(".swiper-button-prev"),
				},
			});
		});
	}
});
