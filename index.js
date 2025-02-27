import TelegramApi from "node-telegram-bot-api";
import { numsOptions } from "./options.js";

const token = "1223121041:AAEzGNVQ14J_Op0hUVk84EV5Z6vFMEOTXpA";

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const start = () => {
    bot.on("message", async (message) => {
        console.log(message)
    
        const text = message.text;
        const chatId = message.chat.id;
    
        bot.setMyCommands([
            { command: "/start", description: "Сначала" },
            { command: "/info", description: "Информация" },
            { command: "/game", description: "Угадай число" },
        ]);
            
        if (text === "/start") {
            await bot.sendMessage(chatId, `Yookoso, ${message.from.first_name}`);
            return bot.sendSticker(chatId, "https://cdn2.combot.org/frieren37/webp/2xf09f9184.webp");
        }

        if (text === "/info") {
            return "Это бот, чтобы показывать разные штуки";
        }

        if (text === "/game") {
            await bot.sendMessage(chatId, "Сейчас я загадаю число от 1 до 9, а ты попробуй его угадать");
            const randomNumber = Math.floor(Math.random() * 10);
            chats[chatId] = randomNumber;
            
            return bot.sendMessage(chatId, "Отгадывай", numsOptions);

        }

        return "Я такое пока не понимаю. Попробуй выбрать одну из существующих команд"
    })

    bot.on("callback_query", (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        console.log(chats)
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, "Ура! Ты угадал!");
        }
        return bot.sendMessage(chatId, "Не угадал, попробуй ещё раз", numsOptions);
    })
}

start();