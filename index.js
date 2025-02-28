import TelegramApi from "node-telegram-bot-api";
import { TOKEN } from "./constants.js";
import { commandsOptions, finishOptions } from "./options.js";
import { numbersGame, getMeme, getRandomPost, getInfo, getStickersLink, onStart } from "./commands/index.js";

const bot = new TelegramApi(TOKEN, { polling: true });

const chats = {};

const onGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random() * 1000);
    chats[chatId] = { number: randomNumber, attempts: 0 };
            
    return bot.sendMessage(chatId, "Я загадала число от 0 до 1000, а ты попробуй его угадать", finishOptions);
}

const onText = async (text, chatId, message) => {
    switch (text) {
        case "/start":
            return onStart(chatId, message.from.first_name, bot);    
        case "/info":
            return getInfo(chatId, bot);   
        case "/game":
            return onGame(chatId, bot);   
        case "/meme":
            return getMeme(chatId, bot);  
        case "/stickers":
            return getStickersLink(chatId, bot);
        case "/randomPost":
            return getRandomPost(chatId, bot);
        default:
            if (chats[chatId]) {
                return numbersGame(chats, chatId, text, bot);
            }
            return bot.sendMessage(chatId, "Я такое пока не понимаю. Попробуй выбрать одну из существующих команд", commandsOptions);
    }
}

const start = () => {
    bot.on("message", async (message) => {
        const text = message.text;
        const chatId = message.chat.id;
    
        bot.setMyCommands([
            { command: "/start", description: "Сначала" },
            { command: "/info", description: "Информация" },
            { command: "/game", description: "Угадай число" },
            { command: "/meme", description: "Картинка дня" },
        ]);

        return onText(text, chatId, message);
    })

    bot.on("callback_query", async (msg) => {
        const text = msg.data;
        const chatId = msg.message.chat.id;

        if (text === "/finish") {
            chats[chatId] = null;
            return bot.sendMessage(chatId, "Приходи поиграть ещё!", commandsOptions);
        }

        if (text === "/menu") {
            return bot.sendMessage(chatId, "Чем займёмся сегодня?", commandsOptions);
        }

        return onText(text, chatId, msg);
    })
}

start();