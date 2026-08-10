document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Footer year
  const currentYear = $("#current-year");
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  // Theme
  const themeToggle = $("#theme-toggle");
  const themeIcon = themeToggle ? $("i", themeToggle) : null;
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const setTheme = (dark) => {
    if (dark) {
      document.documentElement.setAttribute("data-theme", "dark");
      if (themeIcon) themeIcon.className = "fa-solid fa-sun";
      if (themeToggle) themeToggle.setAttribute("aria-label", "Switch to light mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      if (themeIcon) themeIcon.className = "fa-solid fa-moon";
      if (themeToggle) themeToggle.setAttribute("aria-label", "Switch to dark mode");
      localStorage.setItem("theme", "light");
    }
  };

  setTheme(savedTheme === "dark" || (!savedTheme && prefersDark));

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      setTheme(document.documentElement.getAttribute("data-theme") !== "dark");
    });
  }

  // Mobile navigation
  const hamburger = $("#hamburger");
  const navMenu = $("#nav-menu");
  const navLinks = $$(".nav-link");

  const closeMenu = () => {
    if (!navMenu || !hamburger) return;
    navMenu.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    const icon = $("i", hamburger);
    if (icon) icon.className = "fa-solid fa-bars";
  };

  const toggleMenu = () => {
    if (!navMenu || !hamburger) return;
    const active = navMenu.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", String(active));
    const icon = $("i", hamburger);
    if (icon) icon.className = active ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  };

  if (hamburger) hamburger.addEventListener("click", toggleMenu);
  navLinks.forEach(link => link.addEventListener("click", closeMenu));

  document.addEventListener("click", (event) => {
    if (
      navMenu &&
      navMenu.classList.contains("active") &&
      !navMenu.contains(event.target) &&
      !hamburger?.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  // Navbar appearance on scroll
  const navbar = $(".navbar");
  const updateNavbar = () => {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 12);
  };
  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  // Active navigation section
  const sections = $$("section[id]");
  const updateActiveNav = () => {
    const y = window.scrollY + 130;
    let currentId = "home";

    sections.forEach(section => {
      if (y >= section.offsetTop) currentId = section.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  };

  updateActiveNav();
  window.addEventListener("scroll", updateActiveNav, { passive: true });

  // Back to top
  const backToTop = $("#back-to-top");
  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.classList.toggle("visible", window.scrollY > 450);
    };

    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Fade-in animations
  const fadeElements = $$(".fade-in");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add("visible"));
  }

  // Contact form: opens the user's email client.
  const contactForm = $("#contact-form");
  const formStatus = $("#form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = $("#user-name")?.value.trim() || "";
      const email = $("#user-email")?.value.trim() || "";
      const message = $("#user-message")?.value.trim() || "";

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.textContent = "Please complete all fields before sending.";
          formStatus.className = "form-status error";
        }
        return;
      }

      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(
        `${message}\n\nFrom: ${name}\nEmail: ${email}`
      );

      if (formStatus) {
        formStatus.textContent = "Opening your email app...";
        formStatus.className = "form-status success";
      }

      window.location.href =
        `mailto:naboraybales10@gmail.com?subject=${subject}&body=${body}`;

      contactForm.reset();
    });
  }
});
