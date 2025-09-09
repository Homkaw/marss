document.addEventListener("DOMContentLoaded", () => {
  // Главные разделы
  const mainToggles = document.querySelectorAll(".accordion-toggle");
  mainToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      item.classList.toggle("open");
    });
  });

  // Мини-разделы
  const subToggles = document.querySelectorAll(".sub-accordion-toggle");
  subToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      item.classList.toggle("open");
    });
  });
});
