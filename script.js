let currentUser = null; // Текущий пользователь

// Обработчик отображения секций
function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

// Регистрация пользователя
async function registerUser() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (!username || !email || !password) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.status === 201) {
            alert(data.message);
            showSection('login');
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при регистрации.');
    }
}

// Вход пользователя
async function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.status === 200) {
            alert(data.message);
            currentUser = data.user;
            updateUIAfterLogin();
            showSection('account');
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при входе.');
    }
}

// Обновление UI после входа
function updateUIAfterLogin() {
    document.getElementById('login-register-buttons').classList.add('hidden');
    document.getElementById('account-button').classList.remove('hidden');
    document.getElementById('account-name').textContent = currentUser.username;
    document.getElementById('account-email').textContent = currentUser.email;
}

// Выход из аккаунта
function logout() {
    alert('Вы вышли из системы');
    currentUser = null;
    document.getElementById('account-name').textContent = 'Не зарегистрирован';
    document.getElementById('account-email').textContent = 'Не зарегистрирован';
    document.getElementById('login-register-buttons').classList.remove('hidden');
    document.getElementById('account-button').classList.add('hidden');
    showSection('home');
}

// Подписка
function subscribe() {
    if (!currentUser) {
        alert('Пожалуйста, войдите в аккаунт, чтобы оформить подписку.');
        showSection('login');
        return;
    }
    alert('Подписка оформлена!');
    document.getElementById('subscription-status').textContent = 'Оформлена';
}

// Обработчик добавления маршрута
function addRoute() {
    if (!currentUser) {
        alert('Пожалуйста, войдите в аккаунт, чтобы добавить маршрут.');
        showSection('login');
        return;
    }

    const city = document.getElementById('city').value;
    const routeName = document.getElementById('route-name').value;
    const routeType = document.getElementById('route-type').value;
    const routeTransport = document.getElementById('route-transport').value;
    const routeDescription = document.getElementById('route-description').value;
    const streets = Array.from(document.querySelectorAll('input[name^="street-"]')).map(input => input.value);

    console.log({
        city,
        routeName,
        routeType,
        routeTransport,
        routeDescription,
        streets
    });

    alert('Маршрут успешно добавлен!');
    showSection('routes');
}