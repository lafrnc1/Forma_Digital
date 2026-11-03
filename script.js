const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

function closeMenu() {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Ouvrir le menu");
    document.body.classList.remove("menu-open");
}

navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    document.body.classList.toggle("menu-open", isOpen);
});

nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
});
window.addEventListener("hashchange", closeMenu);
window.addEventListener("pageshow", closeMenu);
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
        closeMenu();
        navToggle.focus();
    }
});
window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 20), { passive:true });

closeMenu();

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold:0.12 });
    revealElements.forEach(element => observer.observe(element));
} else {
    revealElements.forEach(element => element.classList.add("visible"));
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");

function setFieldError(field, message) {
    field.setAttribute("aria-invalid", String(Boolean(message)));
    const error = field.closest("label").querySelector(".field-error");
    if (error) error.textContent = message;
}

function validateField(field) {
    const value = field.value.trim();
    let message = "";
    if (field.required && !value) message = "Ce champ est obligatoire.";
    else if (field.type === "email" && value && !field.validity.valid) message = "Saisissez une adresse email valide.";
    else if (field.name === "message" && value && value.length < 20) message = "Décrivez votre projet en au moins 20 caractères.";
    setFieldError(field, message);
    return !message;
}

form.querySelectorAll("[required]").forEach(field => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
});

form.addEventListener("submit", event => {
    event.preventDefault();
    const requiredFields = [...form.querySelectorAll("[required]")];
    const isValid = requiredFields.map(validateField).every(Boolean);
    status.className = "form-status";
    if (!isValid) {
        status.classList.add("error");
        status.textContent = "Veuillez corriger les champs indiqués.";
        requiredFields.find(field => field.getAttribute("aria-invalid") === "true")?.focus();
        return;
    }
    status.classList.add("success");
    status.textContent = "Votre demande est valide, mais le formulaire n'est pas encore connecté à un service d'envoi.";
});

document.querySelectorAll("[data-package]").forEach(link => {
    link.addEventListener("click", () => {
        const project = form.elements.project;
        const packageName = link.dataset.package;
        const projectOptions = {
            "Starter Website": "Site vitrine",
            "Business Website": "Site vitrine",
            "E-commerce Website": "Boutique e-commerce"
        };

        project.value = projectOptions[packageName] || "";
    });
});
