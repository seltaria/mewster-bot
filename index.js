import TelegramApi from "node-telegram-bot-api";
import { TOKEN } from "./constants.js";
import { commandsOptions, finishOptions, gamesOptions } from "./options.js";
import { numbersGame, getMeme, getRandomPost, getInfo, getStickersLink, onStart, onWordsCommand, wordsGame } from "./commands/index.js";

const bot = new TelegramApi(TOKEN, { polling: true });

const chats = {};

const onGame = async (chatId) => {
    const maxNumber = 1000;
    const randomNumber = Math.floor(Math.random() * maxNumber);
    chats[chatId] = { numbers: { number: randomNumber, attempts: 0 } };
            
    return bot.sendMessage(chatId, `Я загадала число от 0 до ${maxNumber}, а ты попробуй его угадать`, finishOptions);
}

const onText = async (text, chatId, message) => {
    switch (text) {
        case "/start":
            return onStart(chatId, message.from.first_name, bot);    
        case "/info":
            return getInfo(chatId, bot);   
        case "/guessNumber":
            return onGame(chatId, bot);   
        case "/words":
            return onWordsCommand(chats, chatId, bot);   
        case "/meme":
            return getMeme(chatId, bot);  
        case "/stickers":
            return getStickersLink(chatId, bot);
        case "/randomPost":
            return getRandomPost(chatId, bot);
        default:
            if (chats[chatId]?.numbers) {
                return numbersGame(chats, chatId, text, bot);
            }
            if (chats[chatId]?.words) {
                return wordsGame(chats, chatId, text, bot);
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
            { command: "/guessNumber", description: "Угадай число" },
            { command: "/words", description: "Играть в слова" },
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

        if (text === "/games") {
            return bot.sendMessage(chatId, "Во что хочешь поиграть?", gamesOptions);
        }

        return onText(text, chatId, msg);
    })
}

start();