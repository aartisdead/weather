require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const API = process.env.BOT_API; // Weather API
const token = process.env.TELEGRAM_TOKEN; // Bot Token
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/weather (.+)/, (msg, match) => {
    const resp = match[1];     // все что введено после команды weather (.+) записвается в респ
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${resp}&units=metric&appid=${API}`;
    const weather = {};
    const chatId = msg.chat.id;
    axios.get(url)
    .then(response => {
        // после отвкта  кидаем в  объект  weather нужные нам значения которые мы получили из JSON
        weather.weather = `${response.data.weather[0].main}, ${response.data.weather[0].description}`;
        weather["city name"] = response.data.name;
        weather.temp = `Tepm : ${response.data.main.temp}C° `;
        weather.wind = `Speed of wind: ${response.data.wind.speed} m/s ${response.data.wind.deg}deg`;
    })
    .then(()=> {
        //отправляем сообщение
        bot.sendMessage(chatId, `In ${weather["city name"]} ${weather.weather} ${weather.wind} ${weather.temp}`);
    })
        .then(() =>  {

        })
    .catch((error) => {
        // смотрим ошибку если нет такого города бросаем сообщение
        error.response.statusText === "Not Found" ?bot.sendMessage(chatId, "Такого города не существует") : console.log(error.statusText)
    })
});