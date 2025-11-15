// app.js - LecturesBase (Демо-версия для GitHub Pages)
let currentUser = null;
let isDemoMode = true;

// Демо-данные
const demoMaterials = [
    {
        id: 1,
        title: "Введение в программирование",
        subject: "Программирование",
        faculty: "it",
        type: "lecture",
        description: "Основные понятия и принципы программирования. Языки программирования, переменные, операторы.",
        fileName: "intro_programming.pdf",
        fileSize: 2540000,
        fileUrl: "#",
        teacherName: "Иванов А.С.",
        groups: ["ИС-21", "ИС-22"],
        accessibleTo: "groups",
        createdAt: new Date('2024-01-15')
    },
    {
        id: 2,
        title: "Линейная алгебра",
        subject: "Математика",
        faculty: "it",
        type: "presentation",
        description: "Матрицы, векторы, системы линейных уравнений. Основные теоремы и методы решения.",
        fileName: "linear_algebra.ppt",
        fileSize: 1850000,
        fileUrl: "#",
        teacherName: "Петрова М.В.",
        groups: [],
        accessibleTo: "all",
        createdAt: new Date('2024-01-10')
    },
    {
        id: 3,
        title: "Основы экономики",
        subject: "Экономика",
        faculty: "economics",
        type: "lecture",
        description: "Введение в экономическую теорию. Спрос, предложение, рыночное равновесие.",
        fileName: "economics_basics.pdf",
        fileSize: 3120000,
        fileUrl: "#",
        teacherName: "Сидоров В.П.",
        groups: ["ЭК-21"],
        accessibleTo: "groups",
        createdAt: new Date('2024-01-12')
    }
];

const demoUsers = [
    {
        uid: "1",
        email: "student@lecturesbase.ru",
        role: "student",
        name: "Студент Демо",
        group: "ИС-21",
        createdAt: new Date()
    },
    {
        uid: "2",
        email: "teacher@lecturesbase.ru",
        role: "teacher",
        name: "Преподаватель Демо",
        group: null,
        createdAt: new Date()
    },
    {
        uid: "3",
        email: "admin@lecturesbase.ru",
        role: "admin",
        name: "Администратор Демо",
        group: null,
        createdAt: new Date()
    }
];

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initAuth();
    loadPublicMaterials();
    
    // Обработчики форм
    document.getElementById('login-form').addEventListener('submit', loginUser);
    document.getElementById('create-user-form').addEventListener('submit', createUser);
    document.getElementById('upload-material-form').addEventListener('submit', uploadMaterial);
    document.getElementById('logout-btn').addEventListener('click', logoutUser);
    
    // Фильтры
    document.getElementById('faculty-select').addEventListener('change', loadPublicMaterials);
    document.getElementById('subject-select').addEventListener('change', loadPublicMaterials);
    document.getElementById('type-select').addEventListener('change', loadPublicMaterials);
    document.getElementById('search-input').addEventListener('input', loadPublicMaterials);
    
    console.log('🚀 LecturesBase загружен в демо-режиме');
});

// Демо-аутентификация
function initAuth() {
    // Проверяем сохраненного пользователя в localStorage
    const savedUser = localStorage.getItem('lecturesbase_currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        setupUI(currentUser);
    } else {
        setupUI(null);
    }
}

// Настройка интерфейса по ролям
function setupUI(userData) {
    const adminLink = document.getElementById('admin-link');
    const teacherLink = document.getElementById('teacher-link');
    const studentLink = document.getElementById('student-link');
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const adminPanel = document.getElementById('admin-panel');
    
    // Скрываем все секции
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.style.display = 'none';
    });
    
    if (userData) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
        
        // Показываем соответствующие ссылки по ролям
        if (userData.role === 'admin') {
            adminLink.style.display = 'block';
            teacherLink.style.display = 'none';
            studentLink.style.display = 'none';
            adminPanel.style.display = 'block';
            showSection('admin');
            loadAdminPanel();
        } else if (userData.role === 'teacher') {
            adminLink.style.display = 'none';
            teacherLink.style.display = 'block';
            studentLink.style.display = 'none';
            showSection('teacher');
            loadTeacherMaterials();
        } else if (userData.role === 'student') {
            adminLink.style.display = 'none';
            teacherLink.style.display = 'none';
            studentLink.style.display = 'block';
            showSection('student');
            loadStudentMaterials();
        }
    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
        adminLink.style.display = 'none';
        teacherLink.style.display = 'none';
        studentLink.style.display = 'none';
        adminPanel.style.display = 'none';
        showSection('login');
    }
}

// Демо-вход пользователя
async function loginUser(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageDiv = document.getElementById('auth-message');
    
    // Демо-проверка
    const user = demoUsers.find(u => u.email === email);
    
    if (user && password === '123456') {
        currentUser = user;
        localStorage.setItem('lecturesbase_currentUser', JSON.stringify(user));
        setupUI(user);
        messageDiv.innerHTML = '<p class="success">✅ Демо-вход выполнен успешно!</p>';
    } else {
        messageDiv.innerHTML = '<p class="error">❌ Неверный email или пароль. Используйте демо-аккаунты.</p>';
    }
}

// Демо-создание пользователя
async function createUser(e) {
    e.preventDefault();
    
    if (!isDemoMode) {
        alert('❌ В демо-режиме создание пользователей отключено');
        return;
    }
    
    const email = document.getElementById('new-user-email').value;
    const password = document.getElementById('new-user-password').value;
    const role = document.getElementById('new-user-role').value;
    const name = document.getElementById('new-user-name').value;
    const group = document.getElementById('new-user-group').value;
    
    // Добавляем в демо-пользователи
    const newUser = {
        uid: Date.now().toString(),
        email: email,
        role: role,
        name: name,
        group: role === 'student' ? group : null,
        createdAt: new Date()
    };
    
    demoUsers.push(newUser);
    
    alert('✅ Демо-пользователь создан! (данные в localStorage)');
    document.getElementById('create-user-form').reset();
    loadAdminPanel();
}

// Демо-загрузка материала
async function uploadMaterial(e) {
    e.preventDefault();
    
    const file = document.getElementById('material-file').files[0];
    const title = document.getElementById('material-title').value;
    const subject = document.getElementById('material-subject').value;
    const faculty = document.getElementById('material-faculty').value;
    const type = document.getElementById('material-type').value;
    const description = document.getElementById('material-description').value;
    const groups = document.getElementById('material-groups').value.split(',').map(g => g.trim()).filter(g => g);
    
    // Создаем демо-материал
    const newMaterial = {
        id: Date.now(),
        title: title,
        subject: subject,
        faculty: faculty,
        type: type,
        description: description,
        fileName: file ? file.name : 'demo_file.pdf',
        fileSize: file ? file.size : 1024000,
        fileUrl: "#",
        teacherName: currentUser.name,
        groups: groups,
        accessibleTo: groups.length > 0 ? 'groups' : 'all',
        createdAt: new Date(),
        teacherId: currentUser.uid
    };
    
    demoMaterials.unshift(newMaterial);
    
    alert('✅ Демо-материал создан! (данные в localStorage)');
    document.getElementById('upload-material-form').reset();
    loadTeacherMaterials();
}

// Загрузка материалов для студента
async function loadStudentMaterials() {
    const studentGroup = currentUser.group;
    const materialsGrid = document.getElementById('student-materials');
    
    materialsGrid.innerHTML = '';
    
    const accessibleMaterials = demoMaterials.filter(material => {
        if (material.accessibleTo === 'all') return true;
        if (material.accessibleTo === 'groups' && material.groups.includes(studentGroup)) return true;
        return false;
    });
    
    if (accessibleMaterials.length === 0) {
        materialsGrid.innerHTML = `
            <div class="no-materials">
                <p>📭 Пока нет доступных материалов для вашей группы (${studentGroup})</p>
                <p><small>Обратитесь к преподавателю для загрузки материалов</small></p>
            </div>
        `;
        return;
    }
    
    accessibleMaterials.forEach(material => {
        materialsGrid.innerHTML += createMaterialCard(material, material.id, true);
    });
}

// Загрузка материалов преподавателя
async function loadTeacherMaterials() {
    const teacherMaterials = demoMaterials.filter(m => m.teacherId === currentUser.uid);
    const materialsGrid = document.getElementById('teacher-materials');
    
    materialsGrid.innerHTML = '';
    
    if (teacherMaterials.length === 0) {
        materialsGrid.innerHTML = `
            <div class="no-materials">
                <p>📭 Вы еще не загрузили ни одного материала</p>
                <p><small>Используйте форму выше для загрузки лекций и материалов</small></p>
            </div>
        `;
        return;
    }
    
    teacherMaterials.forEach(material => {
        materialsGrid.innerHTML += createMaterialCard(material, material.id, false);
    });
}

// Загрузка публичных материалов
async function loadPublicMaterials() {
    const faculty = document.getElementById('faculty-select').value;
    const subject = document.getElementById('subject-select').value;
    const type = document.getElementById('type-select').value;
    const search = document.getElementById('search-input').value.toLowerCase();
    
    const materialsGrid = document.getElementById('public-materials');
    materialsGrid.innerHTML = '';
    
    const publicMaterials = demoMaterials.filter(material => 
        material.accessibleTo === 'all'
    );
    
    let filteredMaterials = publicMaterials.filter(material => {
        if (faculty && material.faculty !== faculty) return false;
        if (subject && material.subject.toLowerCase() !== subject.toLowerCase()) return false;
        if (type && material.type !== type) return false;
        if (search && !material.title.toLowerCase().includes(search) && 
            !material.description.toLowerCase().includes(search)) return false;
        return true;
    });
    
    document.getElementById('materials-count-text').textContent = `Найдено материалов: ${filteredMaterials.length}`;
    
    if (filteredMaterials.length === 0) {
        materialsGrid.innerHTML = `
            <div class="no-materials">
                <p>📭 Материалы не найдены</p>
                <p><small>Попробуйте изменить параметры поиска</small></p>
            </div>
        `;
        return;
    }
    
    filteredMaterials.forEach(material => {
        materialsGrid.innerHTML += createMaterialCard(material, material.id, true);
    });
}

// Создание карточки материала
function createMaterialCard(material, materialId, showDownload = true) {
    const icon = getMaterialIcon(material.type);
    
    return `
        <div class="material-card">
            <div class="card-header">
                <h3>${icon} ${material.title}</h3>
                <div class="subject">${material.subject} • ${material.type}</div>
            </div>
            <div class="card-body">
                <p>${material.description}</p>
                <div class="meta-info">
                    <span class="teacher">👨‍🏫 Преподаватель: ${material.teacherName}</span>
                    <span class="groups">👥 Группы: ${material.groups && material.groups.length > 0 ? material.groups.join(', ') : 'Все'}</span>
                </div>
                <div class="file-info">
                    <span class="file-name">📎 ${material.fileName}</span>
                    <span class="file-size">${formatFileSize(material.fileSize)} • ${material.createdAt.toLocaleDateString('ru-RU')}</span>
                </div>
            </div>
            <div class="card-footer">
                ${showDownload ? 
                    `<a href="${material.fileUrl}" class="download-btn" onclick="alert('В демо-режиме скачивание не доступно')">📥 Скачать (демо)</a>` : 
                    '<span class="uploaded">✅ Загружено</span>'
                }
                <span class="faculty">${getFacultyName(material.faculty)}</span>
            </div>
        </div>
    `;
}

// Загрузка админ-панели
async function loadAdminPanel() {
    document.getElementById('users-count').textContent = demoUsers.length;
    document.getElementById('materials-count').textContent = demoMaterials.length;
    
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = '';
    
    demoUsers.forEach(user => {
        const roleIcon = user.role === 'admin' ? '⚙️' : user.role === 'teacher' ? '👨‍🏫' : '👨‍🎓';
        
        usersList.innerHTML += `
            <div class="user-card">
                <h4>${roleIcon} ${user.name}</h4>
                <p>📧 Email: ${user.email}</p>
                <p>🎯 Роль: ${user.role}</p>
                <p>👥 Группа: ${user.group || '-'}</p>
                <p>📅 Зарегистрирован: ${user.createdAt.toLocaleDateString('ru-RU')}</p>
            </div>
        `;
    });
}

// Вспомогательные функции
function getMaterialIcon(type) {
    const icons = {
        'lecture': '📖',
        'presentation': '📊',
        'methodology': '📋',
        'task': '📝',
        'reference': '📚'
    };
    return icons[type] || '📄';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFacultyName(facultyCode) {
    const faculties = {
        'it': 'ИТ', 
        'economics': 'Экономика', 
        'law': 'Юриспруденция'
    };
    return faculties[facultyCode] || facultyCode;
}

function showSection(sectionId) {
    document.querySelectorAll('.dashboard-section, .auth-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('lecturesbase_currentUser');
    setupUI(null);
}

// Дополнительные функции админа
function showCreateUserForm() {
    document.getElementById('admin-panel').scrollIntoView({ behavior: 'smooth' });
}

function exportData() {
    alert('📊 В демо-режиме экспорт данных не доступен');
}