const routes = {
    recommended: [
        { name: "Маршрут 1", description: "Описание маршрута 1" },
        { name: "Маршрут 2", description: "Описание маршрута 2" },
    ],
    new: [
        { name: "Маршрут 3", description: "Описание маршрута 3" },
    ],
    old: [
        { name: "Маршрут 4", description: "Описание маршрута 4" },
    ],
    popular: [
        { name: "Маршрут 5", description: "Описание маршрута 5" },
    ],
    all: [
        { name: "Маршрут 6", description: "Описание маршрута 6" },
        { name: "Маршрут 7", description: "Описание маршрута 7" },
    ],
};

function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

function loadRoutes(category) {
    // Убираем активные классы с кнопок и вкладок
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.tab-button[data-tab="${category}"]`).classList.add('active');

    const tabContents = document.querySelectorAll('.tab');
    tabContents.forEach(tabContent => tabContent.classList.remove('active'));
    document.getElementById(category).classList.add('active');

    // Загружаем контент для выбранной категории
    const content = routes[category].map(route => {
        return `<div class="card">
                    <h3>${route.name}</h3>
                    <p>${route.description}</p>
                </div>`;
    }).join('');

    document.getElementById(category).innerHTML = content;
}

// Обработчик клика по кнопкам категорий
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function() {
        const category = this.getAttribute('data-tab');
        loadRoutes(category);
    });
});

document.getElementById('add-street-button').addEventListener('click', function() {
    const streetsList = document.getElementById('streets-list');
    const streetItem = document.createElement('div');
    streetItem.className = 'street-item';

    const input = document.createElement('input');
    input.type = 'text';
    input.name = `street-${streetsList.children.length + 1}`;
    input.placeholder = `Улица ${streetsList.children.length + 1}`;
    input.required = true;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Удалить';
    removeButton.classList.add('remove-street-button');
    removeButton.addEventListener('click', function() {
        streetsList.removeChild(streetItem);
    });

    streetItem.appendChild(input);
    streetItem.appendChild(removeButton);
    streetsList.appendChild(streetItem);
});

function registerUser() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    console.log('Пользователь зарегистрирован:', { username, email, password });
}

function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    console.log('Пользователь вошел:', { username, password });
}

function subscribe() {
    alert('Подписка оформлена!');
    document.getElementById('subscription-status').textContent = 'Оформлена';
}

function logout() {
    alert('Вы вышли из системы');
    showSection('home');
}

function addRoute() {
    const city = document.getElementById('city').value;
    const routeName = document.getElementById('route-name').value;
    const routeType = document.getElementById('route-type').value;
    const routeTransport = document.getElementById('route-transport').value;
    const routeDescription = document.getElementById('route-description').value;
    const streets = Array.from(document.querySelectorAll('input[name^="street-"]')).map(input => input.value);

    console.log({
        city, routeName, routeType, routeTransport, routeDescription, streets
    });
}

ymaps.ready(function () {
    var myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 10
    });
});

window.addEventListener('load', function() {
    loadRoutes('recommended'); // Загружаем рекомендованные маршруты по умолчанию
});
