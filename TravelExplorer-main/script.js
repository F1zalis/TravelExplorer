// Текущий пользователь
let currentUser = null;

// Список добавленных маршрутов
let addedRoutes = [];

// Обработчик отображения секций
function showSection(sectionId) {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => section.classList.add('hidden'));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // Закрытие мобильного меню после выбора
    const navLinks = document.querySelector('.nav-links');
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }

    // Обновление активных кнопок навигации
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => button.classList.remove('active'));
    const activeButton = document.querySelector(`.nav-button[onclick*="${sectionId}"]`);
    if (activeButton) activeButton.classList.add('active');

    // Если открывается раздел "Создать маршрут", инициализировать карту
    if (sectionId === 'create') {
        initializeCreateMap();
    }
}

// JavaScript для мобильного меню
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Обработка динамического добавления/удаления улиц
document.getElementById('add-street-button').addEventListener('click', function() {
    const streetsList = document.getElementById('streets-list');
    const streetCount = streetsList.children.length;

    if (streetCount >= 20) { // Максимум 20 улиц
        alert('Можно добавить максимум 20 улиц.');
        return;
    }

    const streetItem = document.createElement('div');
    streetItem.className = 'street-item';

    const input = document.createElement('input');
    input.type = 'text';
    input.name = `street-${streetCount + 1}`;
    input.placeholder = `Улица ${streetCount + 1}`;
    input.required = true;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    removeButton.classList.add('remove-street-button');
    removeButton.addEventListener('click', function() {
        streetsList.removeChild(streetItem);
        renumberStreets();
        updateCreateMap(); // Обновление карты при удалении улицы
    });

    streetItem.appendChild(input);
    streetItem.appendChild(removeButton);
    streetsList.appendChild(streetItem);

    // Добавление обработчика для обновления карты при вводе улицы
    input.addEventListener('input', debounce(updateCreateMap, 500));
});

// Функция перенумерации улиц после удаления
function renumberStreets() {
    const streetsList = document.getElementById('streets-list');
    const streetItems = streetsList.querySelectorAll('.street-item');
    streetItems.forEach((item, index) => {
        const input = item.querySelector('input');
        input.name = `street-${index + 1}`;
        input.placeholder = `Улица ${index + 1}`;
    });
}

// Обработка предпросмотра изображений
document.getElementById('route-images').addEventListener('change', function(event) {
    const preview = document.getElementById('image-preview');
    preview.innerHTML = ''; // Очистка предыдущих превью

    const files = event.target.files;
    if (files.length > 20) { // Максимум 20 изображений
        alert('Можно загрузить максимум 20 изображений.');
        event.target.value = '';
        return;
    }

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add('preview-image');
            img.addEventListener('click', () => openLightbox(e.target.result, file.name));
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});

// Функция открытия lightbox
function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');

    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightbox.classList.remove('hidden');

    // Закрытие lightbox
    closeLightbox.onclick = () => {
        lightbox.classList.add('hidden');
    };

    lightbox.onclick = (event) => {
        if (event.target === lightbox) {
            lightbox.classList.add('hidden');
        }
    };
}

// Регистрация пользователя
function registerUser() {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    if (!username || !email || !password) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    // Валидация email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Пожалуйста, введите корректный email.');
        return;
    }

    // Получение существующих аккаунтов из localStorage
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    // Проверка уникальности имени пользователя и email
    const userExists = accounts.some(acc => acc.username === username || acc.email === email);
    if (userExists) {
        alert('Пользователь с таким именем или email уже существует.');
        return;
    }

    // Добавление нового аккаунта
    const newAccount = { username, email, password };
    accounts.push(newAccount);
    localStorage.setItem('accounts', JSON.stringify(accounts));

    console.log('Пользователь зарегистрирован:', newAccount);
    alert('Регистрация прошла успешно!');
    showSection('login');
}

// Вход пользователя
function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    // Получение аккаунтов из localStorage
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    // Поиск пользователя
    const user = accounts.find(acc => acc.username === username && acc.password === password);
    if (user) {
        alert('Вход выполнен успешно!');
        currentUser = { username: user.username, email: user.email };
        updateUIAfterLogin();
        showSection('account');
    } else {
        alert('Неверное имя пользователя или пароль.');
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
    document.getElementById('subscription-status').textContent = 'Не оформлена';
    document.getElementById('login-register-buttons').classList.remove('hidden');
    document.getElementById('account-button').classList.add('hidden');
    showSection('home');

    // Обновление активных кнопок навигации
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => button.classList.remove('active'));
    // Активировать кнопку "Главная"
    const homeButton = document.querySelector(`.nav-button[onclick*="home"]`);
    if (homeButton) homeButton.classList.add('active');
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

// Добавление маршрута
function addRoute() {
    if (!currentUser) {
        alert('Пожалуйста, войдите в аккаунт, чтобы добавить маршрут.');
        showSection('login');
        return;
    }

    const city = document.getElementById('city').value.trim();
    const routeName = document.getElementById('route-name').value.trim();
    const routeType = document.getElementById('route-type').value;
    const routeTransport = document.getElementById('route-transport').value;
    const routeDescription = document.getElementById('route-description').value.trim();
    const streets = Array.from(document.querySelectorAll('input[name^="street-"]'))
                        .map(input => input.value.trim())
                        .filter(name => name !== '');
    const imageFiles = document.getElementById('route-images').files;

    if (!city || !routeName || streets.length < 5 || imageFiles.length < 4) {
        alert('Пожалуйста, заполните все обязательные поля:\n- Город\n- Название маршрута\n- Минимум 5 улиц\n- Минимум 4 изображения.');
        return;
    }

    if (streets.length > 20) {
        alert('Можно добавить максимум 20 улиц.');
        return;
    }

    if (imageFiles.length > 20) {
        alert('Можно загрузить максимум 20 изображений.');
        return;
    }

    // Валидация названий улиц через Яндекс.Карты
    validateStreets(streets, city)
        .then(valid => {
            if (valid) {
                console.log('Валидация улиц прошла успешно.');
                // Чтение изображений как base64
                const imagesPromises = Array.from(imageFiles).map(file => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            resolve({ name: file.name, data: e.target.result });
                        };
                        reader.onerror = function() {
                            reject('Ошибка чтения файла');
                        };
                        reader.readAsDataURL(file);
                    });
                });

                return Promise.all(imagesPromises);
            } else {
                throw 'Некорректные названия улиц. Пожалуйста, проверьте введённые данные.';
            }
        })
        .then(images => {
            const newRoute = { 
                id: Date.now(), // Уникальный ID маршрута
                city, 
                routeName, 
                routeType, 
                routeTransport, 
                routeDescription, 
                streets, 
                images 
            };
            addedRoutes.push(newRoute);
            console.log('Маршрут добавлен:', newRoute);
            alert('Маршрут успешно добавлен!');
            // Очистка формы
            document.getElementById('create-route-form').reset();
            document.getElementById('image-preview').innerHTML = '';
            // Перенумерация улиц
            renumberStreets();
            // Очистка карты после добавления маршрута
            clearCreateMap();
            showSection('routes');
            loadRoutes('all');
            // Сохранение маршрутов в localStorage
            saveRoutesToLocalStorage();
        })
        .catch(error => {
            console.error(error);
            alert(error);
        });
}

// Валидация названий улиц через API Яндекс.Карт
function validateStreets(streets, city) {
    return new Promise((resolve, reject) => {
        ymaps.ready(function () {
            let validCount = 0;
            let isValid = true;
            const totalStreets = streets.length;

            if (streets.length === 0) {
                resolve(false);
                return;
            }

            streets.forEach(street => {
                const fullAddress = `${street}, ${city}`;
                console.log(`Геокодирование адреса: ${fullAddress}`);
                const geocoder = ymaps.geocode(fullAddress);
                geocoder.then(
                    function (res) {
                        const obj = res.geoObjects.get(0);
                        if (obj) {
                            const coords = obj.geometry.getCoordinates();
                            console.log(`Улица "${street}" найдена по координатам:`, coords);
                            validCount++;
                        } else {
                            console.warn(`Улица "${street}" не найдена.`);
                            isValid = false;
                        }

                        if (validCount + (streets.length - validCount) === streets.length) {
                            resolve(isValid);
                        }
                    },
                    function (err) {
                        console.error(`Ошибка геокодирования для улицы "${street}":`, err);
                        isValid = false;
                        resolve(false);
                    }
                );
            });
        });
    });
}

// Сохранение маршрутов в localStorage
function saveRoutesToLocalStorage() {
    localStorage.setItem('routes', JSON.stringify(addedRoutes));
}

// Загрузка маршрутов из localStorage при инициализации
function loadRoutesFromLocalStorage() {
    const routes = JSON.parse(localStorage.getItem('routes')) || [];
    addedRoutes = routes;
}

// Инициализация маршрутов
loadRoutesFromLocalStorage();
loadRoutes('recommended');

// Обработка вкладок маршрутов
function loadRoutes(category) {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => tab.classList.remove('active'));
    const activeTab = document.querySelector(`.tab-button[data-tab="${category}"]`);
    if (activeTab) activeTab.classList.add('active');

    const tabContents = document.querySelectorAll('.tab');
    tabContents.forEach(tabContent => tabContent.classList.remove('active'));
    const activeTabContent = document.getElementById(category);
    if (activeTabContent) activeTabContent.classList.add('active');

    let content = '';

    // Фильтрация маршрутов по категории
    let filteredRoutes = [];
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

    if (category === 'recommended') {
        // Пример: Рекомендованные маршруты — тип "leisure"
        filteredRoutes = addedRoutes.filter(route => route.routeType === 'leisure');
    } else if (category === 'new') {
        // Пример: Новые маршруты — добавленные за последние 7 дней
        filteredRoutes = addedRoutes.filter(route => route.id >= sevenDaysAgo);
    } else if (category === 'popular') {
        // Пример: Популярные маршруты — количество изображений >= 4
        filteredRoutes = addedRoutes.filter(route => route.images.length >= 4);
    } else if (category === 'all') {
        filteredRoutes = addedRoutes;
    }

    if (filteredRoutes.length === 0) {
        content = '<p>Нет доступных маршрутов для этой категории.</p>';
    } else {
        filteredRoutes.forEach(route => {
            content += `<div class="card" data-route-id="${route.id}">
                        ${route.images && route.images.length > 0 ? `
                        <div class="images-container">
                            ${route.images.slice(0,3).map(img => `<img src="${img.data}" alt="Route Image" onclick="openLightbox('${img.data}', '${img.name}')">`).join('')}
                        </div>` : ''}
                        <h3>${route.routeName}</h3>
                        <p>${route.routeDescription}</p>
                    </div>`;
        });
    }

    activeTabContent.innerHTML = content;

    // Добавление обработчиков событий для карточек маршрутов
    const routeCards = activeTabContent.querySelectorAll('.card');
    routeCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Предотвращение открытия модального окна при клике на изображение
            if (e.target.tagName.toLowerCase() !== 'img') {
                const routeId = card.getAttribute('data-route-id');
                openRouteModal(routeId);
            }
        });
    });
}

// Открытие модального окна с подробной информацией о маршруте
function openRouteModal(routeId) {
    const modal = document.getElementById('route-modal');
    const route = addedRoutes.find(r => r.id == routeId); // Используем == для сравнения типов

    if (!route) {
        alert('Маршрут не найден.');
        return;
    }

    document.getElementById('modal-route-name').textContent = route.routeName;
    document.getElementById('modal-city').textContent = route.city;
    document.getElementById('modal-type').textContent = translateRouteType(route.routeType);
    document.getElementById('modal-description').textContent = route.routeDescription;
    document.getElementById('modal-streets').textContent = route.streets.join(', ');

    // Отображение изображений
    const modalImages = document.getElementById('modal-images');
    modalImages.innerHTML = '';
    route.images.forEach(img => {
        const image = document.createElement('img');
        image.src = img.data;
        image.alt = 'Route Image';
        image.addEventListener('click', () => openLightbox(img.data, img.name));
        modalImages.appendChild(image);
    });

    // Отображение карты
    displayRouteOnMap(route);

    // Оценка времени
    calculateEstimatedTime(route)
        .then(time => {
            document.getElementById('modal-time').textContent = time;
        })
        .catch(error => {
            console.error(error);
            document.getElementById('modal-time').textContent = 'Не удалось оценить время маршрута.';
        });

    modal.classList.remove('hidden');
}

// Закрытие модального окна
function closeModal() {
    const modal = document.getElementById('route-modal');
    modal.classList.add('hidden');
}

// Отображение маршрута на карте
function displayRouteOnMap(route) {
    ymaps.ready(function () {
        const modalMap = document.getElementById('modal-map');
        modalMap.innerHTML = ''; // Очистка предыдущей карты
        var myMap = new ymaps.Map("modal-map", {
            center: [55.76, 37.64], // Координаты Москвы по умолчанию
            zoom: 12
        });

        let points = [];
        let geocodingPromises = [];

        route.streets.forEach(street => {
            const fullAddress = `${street}, ${route.city}`;
            console.log(`Геокодирование адреса для карты: ${fullAddress}`);
            const geocoder = ymaps.geocode(fullAddress);
            const promise = geocoder.then(
                function (res) {
                    const obj = res.geoObjects.get(0);
                    if (obj) {
                        const coords = obj.geometry.getCoordinates();
                        points.push(coords);
                        myMap.geoObjects.add(obj);
                        console.log(`Добавлена точка для улицы "${street}":`, coords);
                    } else {
                        console.warn(`Не удалось найти координаты для улицы "${street}".`);
                    }
                },
                function (err) {
                    console.error(`Ошибка геокодирования для улицы "${street}":`, err);
                }
            );
            geocodingPromises.push(promise);
        });

        Promise.all(geocodingPromises).then(() => {
            if (points.length >= 2) {
                // Получение типа транспорта
                const transportMode = route.routeTransport;

                // Создание маршрута с учетом транспорта и трафика
                ymaps.route(points, {
                    mapStateAutoApply: true,
                    routingMode: getRoutingMode(transportMode)
                }).then(function (routeObj) {
                    // Настройка стилей маршрута в зависимости от транспорта
                    routeObj.getPaths().each(function (path) {
                        switch (transportMode) {
                            case 'auto':
                                path.options.set({
                                    strokeColor: "#FF0000",
                                    strokeWidth: 4,
                                    strokeOpacity: 0.7
                                });
                                break;
                            case 'pedestrian':
                                path.options.set({
                                    strokeColor: "#0000FF",
                                    strokeWidth: 4,
                                    strokeOpacity: 0.7
                                });
                                break;
                            case 'bicycle':
                                path.options.set({
                                    strokeColor: "#00FF00",
                                    strokeWidth: 4,
                                    strokeOpacity: 0.7
                                });
                                break;
                            default:
                                path.options.set({
                                    strokeColor: "#FF0000",
                                    strokeWidth: 4,
                                    strokeOpacity: 0.7
                                });
                        }
                    });
                    myMap.geoObjects.add(routeObj);
                }, function (error) {
                    console.error(error);
                    alert('Не удалось построить маршрут на карте.');
                });
            } else if (points.length === 1) {
                myMap.setCenter(points[0], 14);
            } else {
                alert('Не удалось определить координаты для отображения маршрута на карте.');
            }
        });
    });
}

// Функция для определения режима маршрутизации на основе типа транспорта
function getRoutingMode(transportMode) {
    switch (transportMode) {
        case 'auto':
            return 'auto';
        case 'pedestrian':
            return 'pedestrian';
        case 'bicycle':
            return 'bicycle';
        default:
            return 'auto';
    }
}

// Функция для вычисления времени прохождения маршрута
function calculateEstimatedTime(route) {
    return new Promise((resolve, reject) => {
        ymaps.ready(function () {
            const transportMode = route.routeTransport;
            const streets = route.streets;
            const city = route.city;
            let points = [];

            // Геокодирование улиц для получения координат
            const geocodingPromises = streets.map(street => {
                const fullAddress = `${street}, ${city}`;
                return ymaps.geocode(fullAddress).then(
                    function (res) {
                        const obj = res.geoObjects.get(0);
                        if (obj) {
                            return obj.geometry.getCoordinates();
                        } else {
                            console.warn(`Улица "${street}" не найдена.`);
                            return null;
                        }
                    },
                    function (err) {
                        console.error(`Ошибка геокодирования для улицы "${street}":`, err);
                        return null;
                    }
                );
            });

            Promise.all(geocodingPromises).then(coordsArray => {
                // Фильтрация не найденных координат
                const validCoords = coordsArray.filter(coords => coords !== null);
                if (validCoords.length < 2) {
                    reject('Недостаточно данных для расчета времени.');
                    return;
                }

                points = validCoords;

                // Создание маршрута с учетом транспорта и трафика для расчета времени
                ymaps.route(points, {
                    mapStateAutoApply: true,
                    routingMode: getRoutingMode(transportMode)
                }).then(function (routeObj) {
                    const segments = routeObj.getPaths().get(0).getSegments();
                    let totalTime = 0; // в секундах

                    segments.each(function (segment) {
                        const time = segment.properties.get('time'); // Время в секундах
                        totalTime += time;
                    });

                    const estimatedTime = convertSecondsToMinutes(totalTime);
                    resolve(`${estimatedTime} мин.`);
                }, function (error) {
                    console.error(error);
                    reject('Не удалось рассчитать время маршрута.');
                });
            }).catch(error => {
                console.error(error);
                reject('Ошибка при расчете времени.');
            });
        });
    });
}

// Функция для перевода секунд в минуты
function convertSecondsToMinutes(seconds) {
    return Math.ceil(seconds / 60);
}

// Функция перевода типов маршрутов на русский язык
function translateRouteType(type) {
    const types = {
        'adventure': 'Приключение',
        'leisure': 'Отдых',
        'nature': 'Природа',
        'cultural': 'Культурный',
        'historic': 'Исторический',
        'beach': 'Пляжный',
        'mountain': 'Горный',
        'urban': 'Городской',
        'foot': 'Пешком',
        'pedestrian': 'Пешком',
        'car': 'На машине',
        'auto': 'На машине',
        'bicycle': 'На велосипеде'
    };
    return types[type] || type;
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('route-modal');
    if (event.target == modal) {
        modal.classList.add('hidden');
    }

    const lightbox = document.getElementById('lightbox');
    if (event.target == lightbox) {
        lightbox.classList.add('hidden');
    }
};

// Lightbox: Закрытие при клике на крестик или вне изображения
const lightboxElement = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeLightboxButton = document.querySelector('.close-lightbox');

closeLightboxButton.onclick = () => {
    lightboxElement.classList.add('hidden');
};

lightboxElement.onclick = (event) => {
    if (event.target === lightboxElement) {
        lightboxElement.classList.add('hidden');
    }
};

// Инициализация маршрутов при загрузке страницы
window.addEventListener('load', function() {
    loadRoutes('recommended');
    initializeTheme();
});

// Инициализация карты в разделе "Создать маршрут"
let createMap, createMapObjects = [];

function initializeCreateMap() {
    if (createMap) {
        // Если карта уже инициализирована, обновляем её центр
        createMap.setCenter([55.76, 37.64], 10);
        return;
    }

    ymaps.ready(function () {
        createMap = new ymaps.Map("create-map", {
            center: [55.76, 37.64], // Координаты Москвы по умолчанию
            zoom: 10
        });

        // Добавление слоя полилиний для маршрута
        createMap.routePolyline = new ymaps.Polyline([], {}, {
            strokeColor: "#FF0000",
            strokeWidth: 4,
            strokeOpacity: 0.7
        });
        createMap.geoObjects.add(createMap.routePolyline);
    });
}

// Обновление карты в разделе "Создать маршрут"
function updateCreateMap() {
    if (!createMap) {
        initializeCreateMap();
    }

    const city = document.getElementById('city').value.trim();
    const streetInputs = Array.from(document.querySelectorAll('input[name^="street-"]'))
                                .map(input => input.value.trim())
                                .filter(name => name !== '');

    if (!city || streetInputs.length === 0) {
        // Очистка карты, если нет города или улиц
        clearCreateMap();
        return;
    }

    // Очистка предыдущих объектов
    createMapObjects.forEach(obj => createMap.geoObjects.remove(obj));
    createMapObjects = [];
    createMap.routePolyline.geometry.setCoordinates([]);

    // Геокодирование улиц
    const geocodingPromises = streetInputs.map(street => {
        const fullAddress = `${street}, ${city}`;
        return ymaps.geocode(fullAddress).then(
            function (res) {
                const obj = res.geoObjects.get(0);
                if (obj) {
                    const coords = obj.geometry.getCoordinates();
                    // Добавление маркера
                    const placemark = new ymaps.Placemark(coords, { balloonContent: street }, {
                        preset: 'islands#blueCircleDotIcon'
                    });
                    createMap.geoObjects.add(placemark);
                    createMapObjects.push(placemark);
                    return coords;
                } else {
                    console.warn(`Улица "${street}" не найдена.`);
                    return null;
                }
            },
            function (err) {
                console.error(`Ошибка геокодирования для улицы "${street}":`, err);
                return null;
            }
        );
    });

    Promise.all(geocodingPromises).then(coordsArray => {
        // Фильтрация не найденных координат
        const validCoords = coordsArray.filter(coords => coords !== null);
        if (validCoords.length >= 2) {
            // Получение типа транспорта
            const transportMode = document.getElementById('route-transport').value;

            // Создание маршрута с учетом транспорта и трафика
            ymaps.route(validCoords, {
                mapStateAutoApply: true,
                routingMode: getRoutingMode(transportMode)
            }).then(function (routeObj) {
                // Настройка стилей маршрута в зависимости от транспорта
                routeObj.getPaths().each(function (path) {
                    switch (transportMode) {
                        case 'auto':
                            path.options.set({
                                strokeColor: "#FF0000",
                                strokeWidth: 4,
                                strokeOpacity: 0.7
                            });
                            break;
                        case 'pedestrian':
                            path.options.set({
                                strokeColor: "#0000FF",
                                strokeWidth: 4,
                                strokeOpacity: 0.7
                            });
                            break;
                        case 'bicycle':
                            path.options.set({
                                strokeColor: "#00FF00",
                                strokeWidth: 4,
                                strokeOpacity: 0.7
                            });
                            break;
                        default:
                            path.options.set({
                                strokeColor: "#FF0000",
                                strokeWidth: 4,
                                strokeOpacity: 0.7
                            });
                    }
                });
                createMap.geoObjects.add(routeObj);
            }, function (error) {
                console.error(error);
                alert('Не удалось построить маршрут на карте.');
            });
        } else if (validCoords.length === 1) {
            createMap.setCenter(validCoords[0], 14);
        } else {
            alert('Не удалось определить координаты для отображения маршрута на карте.');
        }
    });
}

// Очистка карты в разделе "Создать маршрут"
function clearCreateMap() {
    // Удаление всех маркеров
    createMapObjects.forEach(obj => createMap.geoObjects.remove(obj));
    createMapObjects = [];
    // Очистка полилинии
    if (createMap && createMap.routePolyline) {
        createMap.routePolyline.geometry.setCoordinates([]);
    }
}

// Дебаунс функция для оптимизации вызовов при вводе
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

// Переключение темы
const themeSwitch = document.getElementById('theme-switch');
themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

// Инициализация темы при загрузке страницы
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
        themeSwitch.checked = true;
    }
}

// Lightbox: Открытие
function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightbox.classList.remove('hidden');
}

// Функция перевода типов маршрутов на русский язык
function translateRouteType(type) {
    const types = {
        'adventure': 'Приключение',
        'leisure': 'Отдых',
        'nature': 'Природа',
        'cultural': 'Культурный',
        'historic': 'Исторический',
        'beach': 'Пляжный',
        'mountain': 'Горный',
        'urban': 'Городской',
        'foot': 'Пешком',
        'pedestrian': 'Пешком',
        'car': 'На машине',
        'auto': 'На машине',
        'bicycle': 'На велосипеде'
    };
    return types[type] || type;
}

// Обработка закрытия модального окна по кнопке
const modalCloseButton = document.querySelector('.close-button');
modalCloseButton.onclick = () => {
    closeModal();
};
