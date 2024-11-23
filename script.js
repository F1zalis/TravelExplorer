document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");


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
    removeButton.className = 'remove-street-button';
    removeButton.textContent = 'Удалить';
    removeButton.style.backgroundColor = 'red';
    removeButton.style.color = 'white';


    removeButton.addEventListener('click', function() {
        streetsList.removeChild(streetItem);
    });


    streetItem.appendChild(input);
    streetItem.appendChild(removeButton);


    streetsList.appendChild(streetItem);
});

    const pages = {
        home: `
            <header>Путешествия</header>
            <nav>
                <button onclick="navigate('home')">Главная</button>
                <button onclick="navigate('find-route')">Найти маршрут</button>
                <button onclick="navigate('create-route')">Создать маршрут</button>
                <button onclick="navigate('account')">Аккаунт</button>
                <button onclick="navigate('login')">Вход</button>
            </nav>
            <div class="background-image">
                Добро пожаловать в мир путешествий!
            </div>
        `,
        "find-route": `
            <header>Найти маршрут</header>
            <nav>
                <button onclick="navigate('home')">Главная</button>
                <button onclick="navigate('find-route')">Найти маршрут</button>
                <button onclick="navigate('create-route')">Создать маршрут</button>
                <button onclick="navigate('account')">Аккаунт</button>
                <button onclick="navigate('login')">Вход</button>
            </nav>
            <div class="container">
                <h1>Найти маршрут</h1>
                <input type="text" placeholder="Введите название маршрута">
                <button>Искать</button>
            </div>
        `,
        "create-route": `
            <header>Создать маршрут</header>
            <nav>
                <button onclick="navigate('home')">Главная</button>
                <button onclick="navigate('find-route')">Найти маршрут</button>
                <button onclick="navigate('create-route')">Создать маршрут</button>
                <button onclick="navigate('account')">Аккаунт</button>
                <button onclick="navigate('login')">Вход</button>
            </nav>
            <div class="container light-background">
                <h1>Создать маршрут</h1>
                <form>
                    <label>Название маршрута:</label>
                    <input type="text" required><br><br>
                    <label>Описание маршрута:</label>
                    <textarea required></textarea><br><br>
                    <button type="submit">Сохранить</button>
                </form>
            </div>
        `,
        account: `
            <header>Аккаунт</header>
            <nav>
                <button onclick="navigate('home')">Главная</button>
                <button onclick="navigate('find-route')">Найти маршрут</button>
                <button onclick="navigate('create-route')">Создать маршрут</button>
                <button onclick="navigate('account')">Аккаунт</button>
                <button onclick="navigate('login')">Вход</button>
            </nav>
            <div class="container">
                <h1>Мой аккаунт</h1>
                <p>Имя: Иван Иванов</p>
                <p>Email: ivan@example.com</p>
            </div>
        `,
        login: `
            <header>Вход</header>
            <nav>
                <button onclick="navigate('home')">Главная</button>
                <button onclick="navigate('find-route')">Найти маршрут</button>
                <button onclick="navigate('create-route')">Создать маршрут</button>
                <button onclick="navigate('account')">Аккаунт</button>
                <button onclick="navigate('login')">Вход</button>
            </nav>
            <div class="container">
                <h1>Вход</h1>
                <form>
                    <label>Логин:</label>
                    <input type="text" required><br><br>
                    <label>Пароль:</label>
                    <input type="password" required><br><br>
                    <button type="submit">Войти</button>
                </form>
            </div>
        `
    };


    window.navigate = (page) => {
        app.innerHTML = pages[page] || pages.home;
    };


    navigate("home");
});
