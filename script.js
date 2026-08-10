document.addEventListener("DOMContentLoaded", () => {
  // Set Footer Year
  const currentYearSpan = document.getElementById("current-year");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 1. Theme Toggle & LocalStorage Initialization
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = themeToggleBtn.querySelector("i");
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const setTheme = (isDark) => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
      themeIcon.className = "fa-solid fa-sun";
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      themeIcon.className = "fa-solid fa-moon";
      localStorage.setItem("theme", "light");
    }
  };

  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    setTheme(true);
  } else {
    setTheme(false);
  }

  themeToggleBtn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    setTheme(!isDark);
  });

  // 2. Mobile Navigation Toggle (Hamburger)
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  const toggleMenu = () => {
    const isActive = navMenu.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", isActive);
    const icon = hamburger.querySelector("i");
    icon.className = isActive ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  };

  hamburger.addEventListener("click", toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        toggleMenu();
      }
    });
  });

  // 3. Active Link State on Scroll
  const sections = document.querySelectorAll("section[id]");

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute("id");
      const navItem = document.querySelector(`.nav-list a[href*="${sectionId}"]`);

      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add("active");
        } else {
          navItem.classList.remove("active");
        }
      }
    });
  };

  window.addEventListener("scroll", highlightNavOnScroll);

  // 4. Back to Top Button
  const backToTopBtn = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // 5. Scroll Fade-in Intersection Observer
  const fadeElements = document.querySelectorAll(".fade-in");

  const fadeObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeElements.forEach((el) => fadeObserver.observe(el));

  // 6. Safe Contact Form Submission Handling
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("user-name").value.trim();
      const email = document.getElementById("user-email").value.trim();
      const message = document.getElementById("user-message").value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = "Please complete all fields before sending.";
        formStatus.className = "form-status error";
        return;
      }

      // Safe mailto fallback or backend hook location (e.g. EmailJS / Formspree)
      const mailtoUrl = `mailto:naboraybales10@gmail.com?subject=Contact%20Form%20from%20${encodeURIComponent(
        name
      )}&body=${encodeURIComponent(message)}%0A%0AFrom:%20${encodeURIComponent(email)}`;

      window.location.href = mailtoUrl;

      formStatus.textContent = "Opening your default email application...";
      formStatus.className = "form-status success";
      contactForm.reset();
    });
  }
});
