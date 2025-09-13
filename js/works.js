const projectsList = document.getElementById("projectsList");
const form = document.getElementById("projectForm");
const adminPanel = document.getElementById("adminPanel");
const imageInput = document.getElementById("imageFile");
const preview = document.getElementById("previewImage");
const loginForm = document.getElementById("loginForm");
const loginPanel = document.getElementById("loginPanel");
const logoutBtn = document.getElementById("logoutBtn");
const showLoginBtn = document.getElementById("showLoginBtn");

let imageDataURL = null;
let isAdmin = false;

showLoginBtn?.addEventListener("click", () => {
  loginPanel.style.display = "block"; // Показываем форму логина
  showLoginBtn.style.display = "none"; // Скрываем кнопку входа
});

const ADMIN_LOGIN = "mars";
const ADMIN_PASSWORD = "19987";

// Проверка авторизации при загрузке
function checkAuth() {
  isAdmin = localStorage.getItem("isAdmin") === "true";
  toggleAdminUI(isAdmin);
  renderProjects();
}

// Обновление интерфейса при логине/логауте
function toggleAdminUI(isAdmin) {
  if (isAdmin) {
    adminPanel.style.display = "block";
    loginPanel.style.display = "none";
    logoutBtn.style.display = "inline-block";
    showLoginBtn.style.display = "none";
  } else {
    adminPanel.style.display = "none";
    loginPanel.style.display = "none";
    logoutBtn.style.display = "none";
    showLoginBtn.style.display = "inline-block";
  }
}

// Обработка формы входа
loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const login = document.getElementById("login").value;
  const password = document.getElementById("password").value;

  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    localStorage.setItem("isAdmin", "true");
    isAdmin = true;
    toggleAdminUI(true);
    renderProjects(); // обновить список с кнопками удаления
  } else {
    alert("Неверный логин или пароль");
  }
});

// Выход
logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("isAdmin");
  isAdmin = false;
  toggleAdminUI(false);
  renderProjects(); // обновить список, убрать кнопки удаления
});

// Превью изображения при загрузке
imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imageDataURL = e.target.result;
      preview.src = imageDataURL;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    alert("Пожалуйста, выберите изображение");
    imageInput.value = "";
    imageDataURL = null;
    preview.style.display = "none";
  }
});

// Работа с localStorage
function getProjects() {
  const saved = localStorage.getItem("projects");
  return saved ? JSON.parse(saved) : [];
}

function saveProjects(data) {
  localStorage.setItem("projects", JSON.stringify(data));
}

// Отображение проектов
function renderProjects() {
  const projects = getProjects();
  projectsList.innerHTML = "";

  projects.forEach((proj, index) => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <div class="project-media">
        <img src="${proj.image}" alt="${proj.title}" />
      </div>
      <div class="project-body">
        <h3 class="project-title">${proj.title}</h3>
        <div class="project-meta">${proj.meta}</div>
        <p>${proj.desc}</p>
        <div class="project-stats">
          <span class="badge">Проект</span>
          ${isAdmin ? `<button onclick="deleteProject(${index})" class="btn-ghost">Удалить</button>` : ""}
        </div>
      </div>
    `;
    projectsList.appendChild(card);
  });
}

// Добавление нового проекта
form?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!imageDataURL) {
    alert("Пожалуйста, загрузите изображение");
    return;
  }

  const newProject = {
    title: document.getElementById("title").value,
    meta: document.getElementById("meta").value,
    desc: document.getElementById("desc").value,
    image: imageDataURL,
  };

  const projects = getProjects();
  projects.unshift(newProject);
  saveProjects(projects);
  renderProjects();

  form.reset();
  imageDataURL = null;
  preview.src = "";
  preview.style.display = "none";
});

// Удаление проекта
function deleteProject(index) {
  const projects = getProjects();
  if (confirm("Удалить проект?")) {
    projects.splice(index, 1);
    saveProjects(projects);
    renderProjects();
  }
}

// Запуск
checkAuth();
