import TelegramApi from "node-telegram-bot-api";
import { commands } from "./constants.js";
import { commandsOptions, finishOptions, gamesOptions } from "./options.js";
import { numbersGame, getMeme, getRandomPost, getInfo, getStickersLink, onStart, onWordsCommand, wordsGame } from "./commands/index.js";
import { isCommand } from "./utils.js";

// TODO: env
// const bot = new TelegramApi(process.env.BOT_TOKEN, { polling: true });
const bot = new TelegramApi("1223121041:AAEzGNVQ14J_Op0hUVk84EV5Z6vFMEOTXpA");

const webhookUrl = 'https://mewster-bot.vercel.app';

bot.setWebHook(webhookUrl)
    .then(() => console.log('Webhook установлен'))
    .catch(console.error);

const chats = {};

const onGame = async (chatId) => {
    const maxNumber = 1000;
    const randomNumber = Math.floor(Math.random() * maxNumber);
    chats[chatId] = { numbers: { number: randomNumber, attempts: 0 } };
            
    return bot.sendMessage(chatId, `Я загадала число от 0 до ${maxNumber}, а ты попробуй его угадать`, finishOptions);
}

const onText = async (text, chatId, message) => {
    if (isCommand(text)) {
        switch (text) {
            case commands.start.command:
                return onStart(chatId, message?.from.first_name || "", bot);    
            case commands.info.command:
                return getInfo(chatId, bot);   
            case commands.guessNumber.command:
                return onGame(chatId, bot);   
            case commands.wordsGame.command:
                return onWordsCommand(chats, chatId, bot);   
            case commands.memeOfTheDay.command:
                return getMeme(chatId, bot);  
            case commands.stickersLink.command:
                return getStickersLink(chatId, bot);
            case commands.randomPostLink.command:
                return getRandomPost(chatId, bot);
            default:
                return bot.sendMessage(chatId, "Я такое пока не понимаю. Попробуй выбрать одну из существующих команд", commandsOptions);
        }
    }

    if (chats[chatId]?.numbers) {
        return numbersGame(chats, chatId, text, bot);
    }
    if (chats[chatId]?.wordGame) {
        return wordsGame(chats, chatId, text, bot);
    }
    return bot.sendMessage(chatId, "Я такое пока не понимаю. Попробуй выбрать одну из существующих команд", commandsOptions);
}

const start = () => {
    bot.on("message", async (message) => {
        const text = message?.text;
        const chatId = message?.chat.id;
    
        bot.setMyCommands(Object.values(commands));

        return onText(text, chatId, message);
    })

    bot.on("callback_query", async (msg) => {
        const text = msg.data;
        const chatId = msg.message?.chat.id;

        if (text === commands.finishGame.command) {
            chats[chatId] = null;
            return bot.sendMessage(chatId, "Приходи поиграть ещё!", commandsOptions);
        }

        if (text === commands.menu.command) {
            return bot.sendMessage(chatId, "Чем займёмся сегодня?", commandsOptions);
        }

        if (text === commands.games.command) {
            return bot.sendMessage(chatId, "Во что хочешь поиграть?", gamesOptions);
        }

        return onText(text, chatId, msg);
    })
}

start();

export default async (req, res) => {
    try {
        await bot.processUpdate(req.body);
    } catch (err) {
        console.error('Error handling update:', err);
    }

    res.status(200);
};
