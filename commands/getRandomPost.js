import { goToMenuOptions } from "../options.js";

export const getRandomPost = (chatId, bot) => {
    const lastPostId = 2001;
    const randomNumber = Math.floor(Math.random() * (lastPostId - 1) + 1);
    return bot.sendMessage(chatId, `https://t.me/expkart/${randomNumber}`, goToMenuOptions)
}