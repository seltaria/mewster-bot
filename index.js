import TelegramApi from "node-telegram-bot-api";
import { commandsOptions, finishOptions } from "./options.js";
import { getNoun } from "./utils.js";

const token = "1223121041:AAEzGNVQ14J_Op0hUVk84EV5Z6vFMEOTXpA";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const onStart = async (chatId, userName) => {
    await bot.sendSticker(chatId, "https://cdn2.combot.org/frieren37/webp/2xf09f9184.webp");
    return bot.sendMessage(chatId, `Yookoso, ${userName}`, commandsOptions);
}

const onInfo = async (chatId) => {
    return bot.sendMessage(chatId, "Я бот, который делает разные штуки");
}

const onGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random() * 1000);
    chats[chatId] = { number: randomNumber, attempts: 0 };
            
    return bot.sendMessage(chatId, "Я загадала число от 0 до 1000, а ты попробуй его угадать", finishOptions);
}

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
            return onStart(chatId, message.from.first_name);
        }

        if (text === "/info") {
            return onInfo(chatId);
        }

        if (text === "/game") {
            return onGame(chatId);
        }

        if (chats[chatId]) {
            if (isNaN(Number(text))) {
                return bot.sendMessage(chatId, "Пиши только числа");
            } else {
                if (text > chats[chatId].number) {
                    chats[chatId].attempts += 1;
                    return bot.sendMessage(chatId, "Моё число меньше, попробуй ещё раз", finishOptions);
                } else if (text < chats[chatId].number) {
                    chats[chatId].attempts += 1;
                    return bot.sendMessage(chatId, "Моё число больше, попробуй ещё раз", finishOptions);
                } else {
                    await bot.sendSticker(chatId, "https://cdn2.combot.org/frieren37/webp/9xf09f9184.webp");
                    await bot.sendMessage(chatId, `Ура! Угадал! Тебе потребовалось всего лишь ${chats[chatId].attempts} ${getNoun(chats[chatId].attempts, ["попытка","попытки","попыток"])}`, commandsOptions);
                    chats[chatId] = null;
                    return;
                }
            }
        }

        return bot.sendMessage(chatId, "Я такое пока не понимаю. Попробуй выбрать одну из существующих команд", commandsOptions);
    })

    bot.on("callback_query", (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === "/finish") {
            chats[chatId] = null;
            return bot.sendMessage(chatId, "Приходи поиграть ещё!", commandsOptions);
        }

        if (data === "/start") {
            onStart(chatId, msg.from.first_name);
        }

        if (data === "/info") {
            onInfo(chatId);
        }

        if (data === "/game") {
            onGame(chatId);
        }
    })
}

start();