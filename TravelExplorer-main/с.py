const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Чтение данных из data.json
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { users: [] };
    }
}

// Запись данных в data.json
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Регистрация пользователя
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Все поля обязательны.' });
    }

    const data = readData();
    const userExists = data.users.find(user => user.email === email);

    if (userExists) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует.' });
    }

    const newUser = { id: Date.now(), username, email, password };
    data.users.push(newUser);
    writeData(data);

    return res.status(201).json({ message: 'Регистрация успешна.' });
});

// Вход пользователя
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Все поля обязательны.' });
    }

    const data = readData();
    const user = data.users.find(user => user.email === email && user.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Неверный email или пароль.' });
    }

    return res.status(200).json({ message: 'Вход выполнен успешно.', user: { id: user.id, username: user.username, email: user.email } });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});