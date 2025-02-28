import { commandsOptions, finishOptions } from "../options.js";
import { getNoun } from "../utils.js";

export const numbersGame = async (chats, chatId, text, bot) => {
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
            await bot.sendMessage(chatId, 
                `Ура! Угадал! Тебе потребовалось всего лишь ${chats[chatId].attempts} 
                ${getNoun(chats[chatId].attempts, ["попытка","попытки","попыток"])}`, commandsOptions);
            chats[chatId] = null;
            return;
        }
    }
}