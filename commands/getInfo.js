import { inlineKeyboard } from "../constants.js";

export const getInfo = async (ctx) => {
  ctx.answerCbQuery();
  await ctx.sendSticker("https://cdn2.combot.org/frieren37/webp/3xf09f9184.webp")
  ctx.reply("Я бот, который делает разные штуки", inlineKeyboard)
}