const menuBtn = document.querySelector(".menu-btn");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const revealEls = document.querySelectorAll(".reveal");
const yearEl = document.getElementById("year");

if (yearEl) {
	yearEl.textContent = new Date().getFullYear();
}

if (menuBtn && siteNav) {
	menuBtn.addEventListener("click", () => {
		const isOpen = siteNav.classList.toggle("open");
		menuBtn.setAttribute("aria-expanded", String(isOpen));
	});
}

navLinks.forEach((link) => {
	link.addEventListener("click", () => {
		if (siteNav && siteNav.classList.contains("open")) {
			siteNav.classList.remove("open");
			menuBtn?.setAttribute("aria-expanded", "false");
		}
	});
});

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("show");
				observer.unobserve(entry.target);
			}
		});
	},
	{
		threshold: 0.14,
	}
);

revealEls.forEach((el) => observer.observe(el));
