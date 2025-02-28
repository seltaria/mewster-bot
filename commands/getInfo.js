import { goToMenuOptions } from "../options.js";

export const getInfo = async (chatId, bot) => {
    await bot.sendSticker(chatId, "https://cdn2.combot.org/frieren37/webp/3xf09f9184.webp");
    return bot.sendMessage(chatId, "Я бот, который делает разные штуки", goToMenuOptions);
}