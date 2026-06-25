document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav a:not(.nav-cta)");
  const sections = document.querySelectorAll("section[id]");
  const fadeElements = document.querySelectorAll(".fade-up");
  const contactForm = document.getElementById("contact-form");

  // 滚动时导航栏阴影
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
    updateActiveNav();
  });

  // 移动端菜单
  menuToggle?.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    nav.classList.toggle("open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle?.classList.remove("active");
      nav?.classList.remove("open");
    });
  });

  // 导航高亮
  function updateActiveNav() {
    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  }

  // 滚动动画
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  fadeElements.forEach((el) => observer.observe(el));

  // 数字滚动动画
  const statNumbers = document.querySelectorAll("[data-count]");
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => statsObserver.observe(el));

  function animateNumber(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const decimal = parseInt(el.dataset.decimal || "0", 10);
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = (target * eased).toFixed(decimal);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // 联系表单（前端演示，可对接后端）
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const lang = localStorage.getItem("lang") || "en";
    const successText = I18N[lang]?.["form.success"] || "Submitted!";
    const originalKey = btn.dataset.i18nKey || "form.submit";
    btn.textContent = successText;
    btn.disabled = true;
    btn.style.background = "#38a169";
    setTimeout(() => {
      contactForm.reset();
      btn.textContent = I18N[lang]?.[originalKey] || btn.textContent;
      btn.disabled = false;
      btn.style.background = "";
    }, 3000);
  });
});
