import * as THREE from "https://unpkg.com/three@0.162.0/build/three.module.js";

const menuBtn = document.querySelector(".menu-btn");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const revealEls = document.querySelectorAll(".reveal");
const yearEl = document.getElementById("year");
const tiltCards = document.querySelectorAll(".tilt-card");

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
		threshold: 0.15,
	}
);

revealEls.forEach((el) => observer.observe(el));

tiltCards.forEach((card) => {
	card.addEventListener("pointermove", (event) => {
		const rect = card.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		const rotateX = ((y / rect.height) - 0.5) * -10;
		const rotateY = ((x / rect.width) - 0.5) * 12;
		card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`;
	});

	card.addEventListener("pointerleave", () => {
		card.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
	});
});

const canvas = document.getElementById("fashion-canvas");
if (canvas) {
	const stage = canvas.parentElement;
	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
	camera.position.set(0, 0.2, 5.2);

	const renderer = new THREE.WebGLRenderer({
		canvas,
		alpha: true,
		antialias: true,
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	const hemiLight = new THREE.HemisphereLight(0x79ffe6, 0x07121a, 1.15);
	const keyLight = new THREE.DirectionalLight(0xff9a59, 1.25);
	keyLight.position.set(3.2, 2, 2.8);
	const rimLight = new THREE.DirectionalLight(0x5eeeff, 0.9);
	rimLight.position.set(-2.6, -1.6, -1.8);

	scene.add(hemiLight, keyLight, rimLight);

	const group = new THREE.Group();
	const coreGeometry = new THREE.TorusKnotGeometry(1.05, 0.28, 230, 28);
	const coreMaterial = new THREE.MeshStandardMaterial({
		color: 0xf25f2f,
		roughness: 0.28,
		metalness: 0.82,
	});
	const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
	group.add(coreMesh);

	const shellGeometry = new THREE.IcosahedronGeometry(1.75, 1);
	const shellMaterial = new THREE.MeshBasicMaterial({
		color: 0x56e9d2,
		wireframe: true,
		opacity: 0.34,
		transparent: true,
	});
	const shellMesh = new THREE.Mesh(shellGeometry, shellMaterial);
	group.add(shellMesh);

	const particleCount = 280;
	const particleGeometry = new THREE.BufferGeometry();
	const particlePositions = new Float32Array(particleCount * 3);

	for (let i = 0; i < particleCount; i += 1) {
		const i3 = i * 3;
		const radius = 2.2 + Math.random() * 1.8;
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.acos(2 * Math.random() - 1);
		particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
		particlePositions[i3 + 1] = radius * Math.cos(phi);
		particlePositions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
	}

	particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
	const particles = new THREE.Points(
		particleGeometry,
		new THREE.PointsMaterial({
			size: 0.03,
			color: 0x9efcef,
			transparent: true,
			opacity: 0.8,
		})
	);
	scene.add(particles);
	scene.add(group);

	const pointer = { x: 0, y: 0 };
	window.addEventListener("pointermove", (event) => {
		pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
		pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
	});

	const resize = () => {
		if (!stage) {
			return;
		}
		const { clientWidth, clientHeight } = stage;
		camera.aspect = clientWidth / clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(clientWidth, clientHeight, false);
	};

	resize();
	window.addEventListener("resize", resize);

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const clock = new THREE.Clock();

	const animate = () => {
		const elapsed = clock.getElapsedTime();

		if (!reduceMotion) {
			group.rotation.x = elapsed * 0.23 + pointer.y * 0.22;
			group.rotation.y = elapsed * 0.35 + pointer.x * 0.26;
			shellMesh.rotation.z = elapsed * 0.2;
			particles.rotation.y = elapsed * 0.06;
		}

		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	};

	animate();
}
