import { commandsOptions } from "../options.js";

export const onStart = async (chatId, userName, bot) => {
    await bot.sendSticker(chatId, "https://cdn2.combot.org/frieren37/webp/2xf09f9184.webp");
    return bot.sendMessage(chatId, `Yookoso, ${userName}`, commandsOptions);
}